"""Preserve original PMX skin weights and bones in a browser-ready GLB.
Model/texture copyright remains with the publisher. No inferred vertex weights.
"""
import io,json,struct,urllib.request,urllib.parse,hashlib,concurrent.futures,os
from pathlib import Path
from PIL import Image
import numpy as np
BASE=Path(os.environ.get('GENSHIN_RIG_CACHE','.cache/original-rigs'))
class Reader:
 def __init__(self,data):self.data=data;self.o=0
 def raw(self,n):
  if n<0 or self.o+n>len(self.data):raise ValueError('PMX bounds')
  b=self.data[self.o:self.o+n];self.o+=n;return b
 def unpack(self,fmt):return struct.unpack('<'+fmt,self.raw(struct.calcsize('<'+fmt)))
 def one(self,fmt):return self.unpack(fmt)[0]
 def string(self):return self.raw(self.one('i')).decode(self.encoding,errors='replace')
 def index(self,size,unsigned=False):return self.one({1:'B' if unsigned else 'b',2:'H' if unsigned else 'h',4:'I' if unsigned else 'i'}[size])
def parse(data):
 r=Reader(data);assert r.raw(4)==b'PMX ';version=r.one('f');g=r.raw(r.one('B'));r.encoding='utf-16-le' if g[0]==0 else 'utf-8';uvs,vs,ts,ms,bs=g[1:6]
 names=[r.string() for _ in range(4)];count=r.one('i');assert 0<count<1000000
 positions=np.empty((count,3),np.float32);normals=positions.copy();uv=np.empty((count,2),np.float32);joints=np.zeros((count,4),np.uint16);weights=np.zeros((count,4),np.float32)
 for i in range(count):
  positions[i]=r.unpack('3f');normals[i]=r.unpack('3f');uv[i]=r.unpack('2f');r.raw(16*uvs);kind=r.one('B')
  if kind==0:js=[r.index(bs)];ws=[1.]
  elif kind in [1,3]:
   js=[r.index(bs),r.index(bs)];w=r.one('f');ws=[w,1-w]
   if kind==3:r.raw(36)
  elif kind in [2,4]:js=[r.index(bs) for _ in range(4)];ws=r.unpack('4f')
  else:raise ValueError('Unknown PMX skin type')
  for k,(j,w) in enumerate(zip(js,ws)):
   if j>=0:joints[i,k]=j;weights[i,k]=max(0,w)
  total=weights[i].sum()
  if total:weights[i]/=total
  else:weights[i,0]=1
  r.raw(4)
 nf=r.one('i');assert 0<nf<10000000;dtype={1:'u1',2:'<u2',4:'<u4'}[vs];indices=np.frombuffer(r.raw(nf*vs),dtype=dtype).astype(np.uint32).reshape(-1,3);indices=indices[:,[0,2,1]].reshape(-1)
 textures=[r.string() for _ in range(r.one('i'))];materials=[]
 for _ in range(r.one('i')):
  name=r.string();r.string();diffuse=r.unpack('4f');r.raw(12+4+12);flags=r.one('B');r.raw(16+4);texture=r.index(ts);r.index(ts);r.raw(1);shared=r.one('B');r.raw(1) if shared else r.index(ts);r.string();surfaces=r.one('i');materials.append(dict(name=name,diffuse=diffuse,flags=flags,texture=texture,count=surfaces))
 bones=[]
 for _ in range(r.one('i')):
  name=r.string();english=r.string();position=r.unpack('3f');parent=r.index(bs);r.raw(4);flags=r.one('H')
  r.index(bs) if flags&1 else r.raw(12)
  if flags&(0x100|0x200):r.index(bs);r.raw(4)
  if flags&0x400:r.raw(12)
  if flags&0x800:r.raw(24)
  if flags&0x2000:r.raw(4)
  if flags&0x20:
   r.index(bs);r.raw(8)
   for _ in range(r.one('i')):
    r.index(bs)
    if r.one('B'):r.raw(24)
  bones.append(dict(name=name or english,position=list(position),parent=parent))
 assert len(bones)>0 and int(joints.max())<len(bones)
 positions[:,2]*=-1;normals[:,2]*=-1
 for b in bones:b['position'][2]*=-1
 return dict(name=names[0],positions=positions,normals=normals,uv=uv,joints=joints,weights=weights,indices=indices,textures=textures,materials=materials,bones=bones)
def fetch_texture(info,path,folder):
 if path.lower().endswith('.sph') or path.lower().endswith('.spa'):return None
 if info.get('local_dir'):
  f=(Path(info['local_dir'])/path.replace('\\','/')).resolve()
  if not f.is_relative_to(Path(info['archive_root']).resolve()):raise ValueError('Texture outside archive')
  if not f.exists():
   choices=[p for p in Path(info['archive_root']).rglob('*') if p.name.casefold()==f.name.casefold()]
   if not choices:raise FileNotFoundError(path)
   f=choices[0]
  image=Image.open(f);image.thumbnail((640,640));image=image.convert('RGBA') if 'A' in image.getbands() else image.convert('RGB');out=io.BytesIO();image.save(out,format='WEBP',quality=85,method=4);return out.getvalue()
 url=urllib.parse.urljoin('https://phoshco.github.io/'+info['directory']+'/',path.replace('\\','/'));url=urllib.parse.quote(url,safe=':/%')
 if urllib.parse.urlsplit(url).hostname!='phoshco.github.io':raise ValueError('Unexpected texture host')
 cached=folder/(hashlib.sha256(url.encode()).hexdigest()+'.webp')
 if cached.exists():return cached.read_bytes()
 data=urllib.request.urlopen(url,timeout=20).read();image=Image.open(io.BytesIO(data));image.thumbnail((640,640));image=image.convert('RGBA') if 'A' in image.getbands() else image.convert('RGB');out=io.BytesIO();image.save(out,format='WEBP',quality=85,method=4);result=out.getvalue();cached.write_bytes(result);return result
def export(parsed,textures):
 binary=bytearray();views=[];accessors=[]
 def view(data,target=None):
  binary.extend(b'\0'*((-len(binary))%4));start=len(binary);binary.extend(data);v=dict(buffer=0,byteOffset=start,byteLength=len(data));
  if target:v['target']=target
  views.append(v);return len(views)-1
 def accessor(array,kind,component,minmax=False,target=34962):
  a=dict(bufferView=view(array.tobytes(),target),componentType=component,count=len(array),type=kind)
  if minmax:a.update(min=array.min(axis=0).tolist(),max=array.max(axis=0).tolist())
  accessors.append(a);return len(accessors)-1
 attrs={'POSITION':accessor(parsed['positions'],'VEC3',5126,True),'NORMAL':accessor(parsed['normals'],'VEC3',5126),'TEXCOORD_0':accessor(parsed['uv'],'VEC2',5126),'JOINTS_0':accessor(parsed['joints'],'VEC4',5123),'WEIGHTS_0':accessor(parsed['weights'],'VEC4',5126)}
 images=[];tex=[];texmap={};materials=[];primitives=[];offset=0
 for m in parsed['materials']:
  material={'name':m['name'],'doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':list(m['diffuse']),'metallicFactor':0,'roughnessFactor':1},'extensions':{'KHR_materials_unlit':{}}}
  data=textures.get(m['texture'])
  if data:
   if m['texture'] not in texmap:
    images.append({'bufferView':view(data),'mimeType':'image/webp'});tex.append({'extensions':{'EXT_texture_webp':{'source':len(images)-1}}});texmap[m['texture']]=len(tex)-1
   material['pbrMetallicRoughness']['baseColorTexture']={'index':texmap[m['texture']]};material['alphaMode']='MASK';material['alphaCutoff']=.05
  elif m['diffuse'][3]<.99:material['alphaMode']='BLEND'
  materials.append(material)
  if m['count'] and m['diffuse'][3]>.001:primitives.append({'attributes':attrs,'indices':accessor(parsed['indices'][offset:offset+m['count']],'SCALAR',5125,target=34963),'material':len(materials)-1})
  offset+=m['count']
 assert offset==len(parsed['indices'])
 bones=parsed['bones'];nodes=[{'name':'Original MMD Rig','children':[1]},{'name':parsed['name'],'mesh':0,'skin':0}];nodes.extend({'name':b['name']} for b in bones);matrices=[]
 for i,b in enumerate(bones):
  parent=b['parent'];p=np.array(b['position']);local=p-np.array(bones[parent]['position']) if 0<=parent<len(bones) and parent!=i else p;nodes[i+2]['translation']=local.tolist()
  if 0<=parent<len(bones) and parent!=i:nodes[parent+2].setdefault('children',[]).append(i+2)
  else:nodes[0]['children'].append(i+2)
  inv=np.eye(4,dtype=np.float32);inv[:3,3]=-p;matrices.append(inv.T.reshape(16))
 ibm=accessor(np.array(matrices,np.float32),'MAT4',5126,target=None)
 gltf={'asset':{'version':'2.0','generator':'Genshin UZ / original PMX skin preservation'},'scene':0,'scenes':[{'nodes':[0]}],'nodes':nodes,'meshes':[{'primitives':primitives}],'skins':[{'joints':list(range(2,len(bones)+2)),'inverseBindMatrices':ibm}],'materials':materials,'textures':tex,'images':images,'accessors':accessors,'bufferViews':views,'buffers':[{'byteLength':len(binary)}],'extensionsUsed':['KHR_materials_unlit','EXT_texture_webp'],'extensionsRequired':['EXT_texture_webp']}
 encoded=json.dumps(gltf,separators=(',',':'),ensure_ascii=False).encode();encoded+=b' '*((-len(encoded))%4);binary.extend(b'\0'*((-len(binary))%4));return struct.pack('<4sII',b'glTF',2,12+8+len(encoded)+8+len(binary))+struct.pack('<I4s',len(encoded),b'JSON')+encoded+struct.pack('<I4s',len(binary),b'BIN\0')+binary

def convert(info):
 folder=BASE/str(info['id']);folder.mkdir(parents=True,exist_ok=True);pmx=folder/'model.pmx'
 url=info.get('rigSource') or urllib.parse.quote('https://phoshco.github.io/'+info['directory']+'/'+info['pmx'],safe=':/')
 if not pmx.exists():pmx.write_bytes(urllib.request.urlopen(url,timeout=25).read())
 parsed=parse(pmx.read_bytes());textures={}
 needed={m['texture'] for m in parsed['materials'] if m['texture']>=0 and m['diffuse'][3]>.001}
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  work={pool.submit(fetch_texture,info,parsed['textures'][i],folder):i for i in needed}
  for task,i in [(t,i) for t,i in work.items()]:
   try:textures[i]=task.result()
   except FileNotFoundError:
    used=[m for m in parsed['materials'] if m['texture']==i and m['count']>0]
    if used and all(m['name']=='目星' for m in used):
     for m in used:m['diffuse']=(*m['diffuse'][:3],0)
    else:raise
 result=export(parsed,textures);out=Path('public/models')/(str(info['id'])+'.glb');out.write_bytes(result)
 return {'id':str(info['id']),'bytes':len(result),'rig':'original-pmx','rigBones':len(parsed['bones']),'rigSource':url,'attribution':'HoYoverse · original PMX via Phoshco'}
if __name__=='__main__':
 import sys
 infos=json.loads(Path(os.environ.get('GENSHIN_RIG_INDEX','scripts/original-rig-index.json')).read_text());ids=set(sys.argv[1:]);infos=[i for i in infos if not ids or str(i['id']) in ids];catalog=json.loads(Path('public/models/catalog.json').read_text())
 def job(info):
  try:return convert(info)
  except Exception as e:return {'id':str(info['id']),'error':str(e)}
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
  tasks={pool.submit(job,i):i for i in infos if str(i['id']) in catalog['models']}
  for task in concurrent.futures.as_completed(tasks):
   result=task.result()
   if 'error' not in result:
    catalog['models'][result['id']].update({k:v for k,v in result.items() if k!='id'})
    Path('public/models/catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,separators=(',',':')))
   print(json.dumps(result),flush=True)
