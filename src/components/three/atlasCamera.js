export function fitAtlasCamera(width,height,aspect,fov=40){
 const tan=Math.tan(fov*Math.PI/360),elevation=.85,depth=Math.sqrt(1-elevation*elevation)
 const distance=(Math.max(width/(2*tan*Math.max(aspect,.1)),height*elevation/(2*tan))+height*depth/2)*1.12
 return{x:0,y:distance*elevation,z:distance*depth,distance}
}
