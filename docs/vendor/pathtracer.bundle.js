/* The rendering engine, bundled by scripts/build_pathtracer.mjs.
   three 0.166.1 (MIT)
   three-mesh-bvh 0.7.8 (MIT)
   three-gpu-pathtracer 0.0.23 (MIT)
   Do not edit: re-run the script. */
(()=>{var Pv=Object.defineProperty;var Hp=(r,t)=>{for(var e in t)Pv(r,e,{get:t[e],enumerable:!0})};var $d={};Hp($d,{ACESFilmicToneMapping:()=>e0,AddEquation:()=>Ei,AddOperation:()=>Kg,AdditiveAnimationBlendMode:()=>zd,AdditiveBlending:()=>wo,AgXToneMapping:()=>i0,AlphaFormat:()=>Fd,AlwaysCompare:()=>v0,AlwaysDepth:()=>Wg,AlwaysStencilFunc:()=>pf,AmbientLight:()=>Zl,AnimationAction:()=>iu,AnimationClip:()=>Er,AnimationLoader:()=>Wf,AnimationMixer:()=>od,AnimationObjectGroup:()=>sd,AnimationUtils:()=>uw,ArcCurve:()=>ml,ArrayCamera:()=>nl,ArrowHelper:()=>Ad,AttachedBindMode:()=>df,Audio:()=>eu,AudioAnalyser:()=>id,AudioContext:()=>ua,AudioListener:()=>ed,AudioLoader:()=>jf,AxesHelper:()=>Ed,BackSide:()=>Ie,BasicDepthPacking:()=>l0,BasicShadowMap:()=>Nv,BatchedMesh:()=>ul,Bone:()=>Xo,BooleanKeyframeTrack:()=>mi,Box2:()=>pd,Box3:()=>re,Box3Helper:()=>Td,BoxGeometry:()=>pi,BoxHelper:()=>Sd,BufferAttribute:()=>Ft,BufferGeometry:()=>Rt,BufferGeometryLoader:()=>tu,ByteType:()=>As,Cache:()=>hi,Camera:()=>Li,CameraHelper:()=>Md,CanvasTexture:()=>zf,CapsuleGeometry:()=>bl,CatmullRomCurve3:()=>gl,CineonToneMapping:()=>t0,CircleGeometry:()=>Ml,ClampToEdgeWrapping:()=>ge,Clock:()=>Ss,Color:()=>at,ColorKeyframeTrack:()=>sa,ColorManagement:()=>se,CompressedArrayTexture:()=>Bf,CompressedCubeTexture:()=>Of,CompressedTexture:()=>xs,CompressedTextureLoader:()=>Xf,ConeGeometry:()=>Sl,ConstantAlphaFactor:()=>Vg,ConstantColorFactor:()=>zg,CubeCamera:()=>tl,CubeReflectionMapping:()=>di,CubeRefractionMapping:()=>Ci,CubeTexture:()=>xr,CubeTextureLoader:()=>qf,CubeUVReflectionMapping:()=>ws,CubicBezierCurve:()=>Yo,CubicBezierCurve3:()=>xl,CubicInterpolant:()=>Wl,CullFaceBack:()=>uf,CullFaceFront:()=>Sg,CullFaceFrontBack:()=>Fv,CullFaceNone:()=>Mg,Curve:()=>Tn,CurvePath:()=>yl,CustomBlending:()=>wg,CustomToneMapping:()=>n0,CylinderGeometry:()=>_s,Cylindrical:()=>dd,Data3DTexture:()=>Oo,DataArrayTexture:()=>Pi,DataTexture:()=>jt,DataTextureLoader:()=>aa,DataUtils:()=>Oe,DecrementStencilOp:()=>qv,DecrementWrapStencilOp:()=>$v,DefaultLoadingManager:()=>U0,DepthFormat:()=>dr,DepthStencilFormat:()=>gr,DepthTexture:()=>Vo,DetachedBindMode:()=>s0,DirectionalLight:()=>$l,DirectionalLightHelper:()=>bd,DiscreteInterpolant:()=>Xl,DisplayP3ColorSpace:()=>cu,DodecahedronGeometry:()=>Tl,DoubleSide:()=>dn,DstAlphaFactor:()=>Fg,DstColorFactor:()=>Ug,DynamicCopyUsage:()=>l_,DynamicDrawUsage:()=>i_,DynamicReadUsage:()=>o_,EdgesGeometry:()=>wl,EllipseCurve:()=>vs,EqualCompare:()=>p0,EqualDepth:()=>qg,EqualStencilFunc:()=>Qv,EquirectangularReflectionMapping:()=>kn,EquirectangularRefractionMapping:()=>Eo,Euler:()=>Sn,EventDispatcher:()=>Vn,ExtrudeGeometry:()=>Al,FileLoader:()=>Hn,Float16BufferAttribute:()=>Mf,Float32BufferAttribute:()=>yt,FloatType:()=>Dt,Fog:()=>rl,FogExp2:()=>il,FramebufferTexture:()=>Uf,FrontSide:()=>pn,Frustum:()=>vr,GLBufferAttribute:()=>ud,GLSL1:()=>h_,GLSL3:()=>mf,GreaterCompare:()=>m0,GreaterDepth:()=>$g,GreaterEqualCompare:()=>x0,GreaterEqualDepth:()=>Yg,GreaterEqualStencilFunc:()=>n_,GreaterStencilFunc:()=>t_,GridHelper:()=>_d,Group:()=>Ri,HalfFloatType:()=>me,HemisphereLight:()=>Yl,HemisphereLightHelper:()=>vd,IcosahedronGeometry:()=>El,ImageBitmapLoader:()=>Qf,ImageLoader:()=>Rr,ImageUtils:()=>Qc,IncrementStencilOp:()=>Xv,IncrementWrapStencilOp:()=>Yv,InstancedBufferAttribute:()=>Ui,InstancedBufferGeometry:()=>jl,InstancedInterleavedBuffer:()=>ld,InstancedMesh:()=>ll,Int16BufferAttribute:()=>yf,Int32BufferAttribute:()=>bf,Int8BufferAttribute:()=>xf,IntType:()=>Oi,InterleavedBuffer:()=>gs,InterleavedBufferAttribute:()=>yr,Interpolant:()=>Sr,InterpolateDiscrete:()=>Co,InterpolateLinear:()=>Kc,InterpolateSmooth:()=>Mc,InvertStencilOp:()=>Zv,KeepStencilOp:()=>ar,KeyframeTrack:()=>wn,LOD:()=>ol,LatheGeometry:()=>Qo,Layers:()=>ds,LessCompare:()=>d0,LessDepth:()=>Xg,LessEqualCompare:()=>kd,LessEqualDepth:()=>Ao,LessEqualStencilFunc:()=>jv,LessStencilFunc:()=>Kv,Light:()=>ti,LightProbe:()=>Kl,Line:()=>Qn,Line3:()=>ln,LineBasicMaterial:()=>Ze,LineCurve:()=>$o,LineCurve3:()=>vl,LineDashedMaterial:()=>Gl,LineLoop:()=>dl,LineSegments:()=>Cn,LinearDisplayP3ColorSpace:()=>pa,LinearFilter:()=>Qt,LinearInterpolant:()=>ra,LinearMipMapLinearFilter:()=>Dd,LinearMipMapNearestFilter:()=>Ov,LinearMipmapLinearFilter:()=>Zn,LinearMipmapNearestFilter:()=>mo,LinearSRGBColorSpace:()=>Wn,LinearToneMapping:()=>Qg,LinearTransfer:()=>Po,Loader:()=>rn,LoaderUtils:()=>la,LoadingManager:()=>oa,LoopOnce:()=>o0,LoopPingPong:()=>c0,LoopRepeat:()=>a0,LuminanceAlphaFormat:()=>Bd,LuminanceFormat:()=>Ud,MOUSE:()=>Dv,Material:()=>We,MaterialLoader:()=>Ql,MathUtils:()=>R_,Matrix3:()=>Ht,Matrix4:()=>dt,MaxEquation:()=>Cg,Mesh:()=>Zt,MeshBasicMaterial:()=>mn,MeshDepthMaterial:()=>Ho,MeshDistanceMaterial:()=>Go,MeshLambertMaterial:()=>Vl,MeshMatcapMaterial:()=>Hl,MeshNormalMaterial:()=>kl,MeshPhongMaterial:()=>Ol,MeshPhysicalMaterial:()=>Bl,MeshStandardMaterial:()=>jn,MeshToonMaterial:()=>zl,MinEquation:()=>Rg,MirroredRepeatWrapping:()=>Ro,MixOperation:()=>Jg,MultiplyBlending:()=>ff,MultiplyOperation:()=>fa,NearestFilter:()=>Nt,NearestMipMapLinearFilter:()=>Bv,NearestMipMapNearestFilter:()=>Uv,NearestMipmapLinearFilter:()=>os,NearestMipmapNearestFilter:()=>Pd,NeutralToneMapping:()=>r0,NeverCompare:()=>f0,NeverDepth:()=>Gg,NeverStencilFunc:()=>Jv,NoBlending:()=>Ne,NoColorSpace:()=>li,NoToneMapping:()=>zn,NormalAnimationBlendMode:()=>au,NormalBlending:()=>On,NotEqualCompare:()=>g0,NotEqualDepth:()=>Zg,NotEqualStencilFunc:()=>e_,NumberKeyframeTrack:()=>Tr,Object3D:()=>oe,ObjectLoader:()=>Kf,ObjectSpaceNormalMap:()=>h0,OctahedronGeometry:()=>na,OneFactor:()=>Pg,OneMinusConstantAlphaFactor:()=>Hg,OneMinusConstantColorFactor:()=>kg,OneMinusDstAlphaFactor:()=>Ng,OneMinusDstColorFactor:()=>Bg,OneMinusSrcAlphaFactor:()=>Tc,OneMinusSrcColorFactor:()=>Lg,OrthographicCamera:()=>Fi,P3Primaries:()=>Lo,PCFShadowMap:()=>Id,PCFSoftShadowMap:()=>Tg,PMREMGenerator:()=>_r,Path:()=>br,PerspectiveCamera:()=>_e,Plane:()=>fn,PlaneGeometry:()=>ms,PlaneHelper:()=>wd,PointLight:()=>bs,PointLightHelper:()=>xd,Points:()=>pl,PointsMaterial:()=>qo,PolarGridHelper:()=>yd,PolyhedronGeometry:()=>Bi,PositionalAudio:()=>nd,PropertyBinding:()=>he,PropertyMixer:()=>nu,QuadraticBezierCurve:()=>Zo,QuadraticBezierCurve3:()=>Jo,Quaternion:()=>Ge,QuaternionKeyframeTrack:()=>wr,QuaternionLinearInterpolant:()=>ql,RED_GREEN_RGTC2_Format:()=>Zc,RED_RGTC1_Format:()=>Od,REVISION:()=>Ts,RGBADepthPacking:()=>u0,RGBAFormat:()=>Lt,RGBAIntegerFormat:()=>ki,RGBA_ASTC_10x10_Format:()=>Gc,RGBA_ASTC_10x5_Format:()=>kc,RGBA_ASTC_10x6_Format:()=>Vc,RGBA_ASTC_10x8_Format:()=>Hc,RGBA_ASTC_12x10_Format:()=>Wc,RGBA_ASTC_12x12_Format:()=>Xc,RGBA_ASTC_4x4_Format:()=>Dc,RGBA_ASTC_5x4_Format:()=>Lc,RGBA_ASTC_5x5_Format:()=>Fc,RGBA_ASTC_6x5_Format:()=>Nc,RGBA_ASTC_6x6_Format:()=>Uc,RGBA_ASTC_8x5_Format:()=>Bc,RGBA_ASTC_8x6_Format:()=>Oc,RGBA_ASTC_8x8_Format:()=>zc,RGBA_BPTC_Format:()=>yo,RGBA_ETC2_EAC_Format:()=>Pc,RGBA_PVRTC_2BPPV1_Format:()=>Rc,RGBA_PVRTC_4BPPV1_Format:()=>Ec,RGBA_S3TC_DXT1_Format:()=>xo,RGBA_S3TC_DXT3_Format:()=>vo,RGBA_S3TC_DXT5_Format:()=>_o,RGBFormat:()=>Nd,RGBIntegerFormat:()=>zv,RGB_BPTC_SIGNED_Format:()=>qc,RGB_BPTC_UNSIGNED_Format:()=>Yc,RGB_ETC1_Format:()=>Cc,RGB_ETC2_Format:()=>Ic,RGB_PVRTC_2BPPV1_Format:()=>Ac,RGB_PVRTC_4BPPV1_Format:()=>wc,RGB_S3TC_DXT1_Format:()=>go,RGFormat:()=>Ir,RGIntegerFormat:()=>zi,RawShaderMaterial:()=>Ul,Ray:()=>Di,Raycaster:()=>hd,Rec709Primaries:()=>Do,RectAreaLight:()=>Ms,RedFormat:()=>Gn,RedIntegerFormat:()=>Cr,ReinhardToneMapping:()=>jg,RenderTarget:()=>jc,RepeatWrapping:()=>$e,ReplaceStencilOp:()=>Wv,ReverseSubtractEquation:()=>Eg,RingGeometry:()=>Rl,SIGNED_RED_GREEN_RGTC2_Format:()=>Jc,SIGNED_RED_RGTC1_Format:()=>$c,SRGBColorSpace:()=>Rn,SRGBTransfer:()=>pe,Scene:()=>Ni,ShaderChunk:()=>Yt,ShaderLib:()=>Un,ShaderMaterial:()=>Pe,ShadowMaterial:()=>Nl,Shape:()=>fi,ShapeGeometry:()=>Cl,ShapePath:()=>Rd,ShapeUtils:()=>Kn,ShortType:()=>da,Skeleton:()=>cl,SkeletonHelper:()=>gd,SkinnedMesh:()=>al,Source:()=>Bn,Sphere:()=>Ue,SphereGeometry:()=>ia,Spherical:()=>ha,SphericalHarmonics3:()=>Jl,SplineCurve:()=>Ko,SpotLight:()=>ys,SpotLightHelper:()=>md,Sprite:()=>sl,SpriteMaterial:()=>Wo,SrcAlphaFactor:()=>Sc,SrcAlphaSaturateFactor:()=>Og,SrcColorFactor:()=>Dg,StaticCopyUsage:()=>c_,StaticDrawUsage:()=>Fo,StaticReadUsage:()=>s_,StereoCamera:()=>td,StreamCopyUsage:()=>u_,StreamDrawUsage:()=>r_,StreamReadUsage:()=>a_,StringKeyframeTrack:()=>gi,SubtractEquation:()=>Ag,SubtractiveBlending:()=>hf,TOUCH:()=>Lv,TangentSpaceNormalMap:()=>Vi,TetrahedronGeometry:()=>Il,Texture:()=>Be,TextureLoader:()=>Yf,TextureUtils:()=>vT,TorusGeometry:()=>Pl,TorusKnotGeometry:()=>Dl,Triangle:()=>en,TriangleFanDrawMode:()=>Hv,TriangleStripDrawMode:()=>Vv,TrianglesDrawMode:()=>kv,TubeGeometry:()=>Ll,UVMapping:()=>ru,Uint16BufferAttribute:()=>zo,Uint32BufferAttribute:()=>ko,Uint8BufferAttribute:()=>vf,Uint8ClampedBufferAttribute:()=>_f,Uniform:()=>ad,UniformsGroup:()=>cd,UniformsLib:()=>ut,UniformsUtils:()=>S0,UnsignedByteType:()=>cn,UnsignedInt248Type:()=>mr,UnsignedInt5999Type:()=>Ld,UnsignedIntType:()=>nn,UnsignedShort4444Type:()=>su,UnsignedShort5551Type:()=>ou,UnsignedShortType:()=>Ii,VSMShadowMap:()=>$n,Vector2:()=>X,Vector3:()=>R,Vector4:()=>Kt,VectorKeyframeTrack:()=>Ar,VideoTexture:()=>Nf,WebGL3DRenderTarget:()=>gf,WebGLArrayRenderTarget:()=>Bo,WebGLCoordinateSystem:()=>Jn,WebGLCubeRenderTarget:()=>el,WebGLMultipleRenderTargets:()=>Cd,WebGLRenderTarget:()=>be,WebGLRenderer:()=>Df,WebGLUtils:()=>C0,WebGPUCoordinateSystem:()=>No,WireframeGeometry:()=>Fl,WrapAroundEnding:()=>Io,ZeroCurvatureEnding:()=>ur,ZeroFactor:()=>Ig,ZeroSlopeEnding:()=>hr,ZeroStencilOp:()=>Gv,createCanvasElement:()=>y0});var Ts="166",Dv={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Lv={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Mg=0,uf=1,Sg=2,Fv=3,Nv=0,Id=1,Tg=2,$n=3,pn=0,Ie=1,dn=2,Ne=0,On=1,wo=2,hf=3,ff=4,wg=5,Ei=100,Ag=101,Eg=102,Rg=103,Cg=104,Ig=200,Pg=201,Dg=202,Lg=203,Sc=204,Tc=205,Fg=206,Ng=207,Ug=208,Bg=209,Og=210,zg=211,kg=212,Vg=213,Hg=214,Gg=0,Wg=1,Xg=2,Ao=3,qg=4,Yg=5,$g=6,Zg=7,fa=0,Jg=1,Kg=2,zn=0,Qg=1,jg=2,t0=3,e0=4,n0=5,i0=6,r0=7,df="attached",s0="detached",ru=300,di=301,Ci=302,kn=303,Eo=304,ws=306,$e=1e3,ge=1001,Ro=1002,Nt=1003,Pd=1004,Uv=1004,os=1005,Bv=1005,Qt=1006,mo=1007,Ov=1007,Zn=1008,Dd=1008,cn=1009,As=1010,da=1011,Ii=1012,Oi=1013,nn=1014,Dt=1015,me=1016,su=1017,ou=1018,mr=1020,Ld=35902,Fd=1021,Nd=1022,Lt=1023,Ud=1024,Bd=1025,dr=1026,gr=1027,Gn=1028,Cr=1029,Ir=1030,zi=1031,zv=1032,ki=1033,go=33776,xo=33777,vo=33778,_o=33779,wc=35840,Ac=35841,Ec=35842,Rc=35843,Cc=36196,Ic=37492,Pc=37496,Dc=37808,Lc=37809,Fc=37810,Nc=37811,Uc=37812,Bc=37813,Oc=37814,zc=37815,kc=37816,Vc=37817,Hc=37818,Gc=37819,Wc=37820,Xc=37821,yo=36492,qc=36494,Yc=36495,Od=36283,$c=36284,Zc=36285,Jc=36286,o0=2200,a0=2201,c0=2202,Co=2300,Kc=2301,Mc=2302,ur=2400,hr=2401,Io=2402,au=2500,zd=2501,kv=0,Vv=1,Hv=2,l0=3200,u0=3201,Vi=0,h0=1,li="",Rn="srgb",Wn="srgb-linear",cu="display-p3",pa="display-p3-linear",Po="linear",pe="srgb",Do="rec709",Lo="p3",Gv=0,ar=7680,Wv=7681,Xv=7682,qv=7683,Yv=34055,$v=34056,Zv=5386,Jv=512,Kv=513,Qv=514,jv=515,t_=516,e_=517,n_=518,pf=519,f0=512,d0=513,p0=514,kd=515,m0=516,g0=517,x0=518,v0=519,Fo=35044,i_=35048,r_=35040,s_=35045,o_=35049,a_=35041,c_=35046,l_=35050,u_=35042,h_="100",mf="300 es",Jn=2e3,No=2001,Vn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let i=this._listeners[t];if(i!==void 0){let s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,t);t.target=null}}},Qe=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Gp=1234567,pr=Math.PI/180,fs=180/Math.PI;function Mn(){let r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qe[r&255]+Qe[r>>8&255]+Qe[r>>16&255]+Qe[r>>24&255]+"-"+Qe[t&255]+Qe[t>>8&255]+"-"+Qe[t>>16&15|64]+Qe[t>>24&255]+"-"+Qe[e&63|128]+Qe[e>>8&255]+"-"+Qe[e>>16&255]+Qe[e>>24&255]+Qe[n&255]+Qe[n>>8&255]+Qe[n>>16&255]+Qe[n>>24&255]).toLowerCase()}function Ae(r,t,e){return Math.max(t,Math.min(e,r))}function Vd(r,t){return(r%t+t)%t}function f_(r,t,e,n,i){return n+(r-t)*(i-n)/(e-t)}function d_(r,t,e){return r!==t?(e-r)/(t-r):0}function bo(r,t,e){return(1-e)*r+e*t}function p_(r,t,e,n){return bo(r,t,1-Math.exp(-e*n))}function m_(r,t=1){return t-Math.abs(Vd(r,t*2)-t)}function g_(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*(3-2*r))}function x_(r,t,e){return r<=t?0:r>=e?1:(r=(r-t)/(e-t),r*r*r*(r*(r*6-15)+10))}function v_(r,t){return r+Math.floor(Math.random()*(t-r+1))}function __(r,t){return r+Math.random()*(t-r)}function y_(r){return r*(.5-Math.random())}function b_(r){r!==void 0&&(Gp=r);let t=Gp+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function M_(r){return r*pr}function S_(r){return r*fs}function T_(r){return(r&r-1)===0&&r!==0}function w_(r){return Math.pow(2,Math.ceil(Math.log(r)/Math.LN2))}function A_(r){return Math.pow(2,Math.floor(Math.log(r)/Math.LN2))}function E_(r,t,e,n,i){let s=Math.cos,o=Math.sin,a=s(e/2),c=o(e/2),l=s((t+n)/2),h=o((t+n)/2),f=s((t-n)/2),u=o((t-n)/2),d=s((n-t)/2),g=o((n-t)/2);switch(i){case"XYX":r.set(a*h,c*f,c*u,a*l);break;case"YZY":r.set(c*u,a*h,c*f,a*l);break;case"ZXZ":r.set(c*f,c*u,a*h,a*l);break;case"XZX":r.set(a*h,c*g,c*d,a*l);break;case"YXY":r.set(c*d,a*h,c*g,a*l);break;case"ZYZ":r.set(c*g,c*d,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function an(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function Xt(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}var R_={DEG2RAD:pr,RAD2DEG:fs,generateUUID:Mn,clamp:Ae,euclideanModulo:Vd,mapLinear:f_,inverseLerp:d_,lerp:bo,damp:p_,pingpong:m_,smoothstep:g_,smootherstep:x_,randInt:v_,randFloat:__,randFloatSpread:y_,seededRandom:b_,degToRad:M_,radToDeg:S_,isPowerOfTwo:T_,ceilPowerOfTwo:w_,floorPowerOfTwo:A_,setQuaternionFromProperEuler:E_,normalize:Xt,denormalize:an},X=class r{constructor(t=0,e=0){r.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*i+t.x,this.y=s*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},Ht=class r{constructor(t,e,n,i,s,o,a,c,l){r.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,c,l)}set(t,e,n,i,s,o,a,c,l){let h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],f=n[7],u=n[2],d=n[5],g=n[8],x=i[0],p=i[3],m=i[6],_=i[1],v=i[4],y=i[7],w=i[2],S=i[5],T=i[8];return s[0]=o*x+a*_+c*w,s[3]=o*p+a*v+c*S,s[6]=o*m+a*y+c*T,s[1]=l*x+h*_+f*w,s[4]=l*p+h*v+f*S,s[7]=l*m+h*y+f*T,s[2]=u*x+d*_+g*w,s[5]=u*p+d*v+g*S,s[8]=u*m+d*y+g*T,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*s*h+n*a*c+i*s*l-i*o*c}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],f=h*o-a*l,u=a*c-h*s,d=l*s-o*c,g=e*f+n*u+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return t[0]=f*x,t[1]=(i*l-h*n)*x,t[2]=(a*n-i*o)*x,t[3]=u*x,t[4]=(h*e-i*c)*x,t[5]=(i*s-a*e)*x,t[6]=d*x,t[7]=(n*c-l*e)*x,t[8]=(o*e-n*s)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,o,a){let c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-i*l,i*c,-i*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Th.makeScale(t,e)),this}rotate(t){return this.premultiply(Th.makeRotation(-t)),this}translate(t,e){return this.premultiply(Th.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Th=new Ht;function _0(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}var C_={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function as(r,t){return new C_[r](t)}function Uo(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function y0(){let r=Uo("canvas");return r.style.display="block",r}var Wp={};function Hd(r){r in Wp||(Wp[r]=!0,console.warn(r))}function I_(r,t,e){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}var Xp=new Ht().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),qp=new Ht().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ia={[Wn]:{transfer:Po,primaries:Do,toReference:r=>r,fromReference:r=>r},[Rn]:{transfer:pe,primaries:Do,toReference:r=>r.convertSRGBToLinear(),fromReference:r=>r.convertLinearToSRGB()},[pa]:{transfer:Po,primaries:Lo,toReference:r=>r.applyMatrix3(qp),fromReference:r=>r.applyMatrix3(Xp)},[cu]:{transfer:pe,primaries:Lo,toReference:r=>r.convertSRGBToLinear().applyMatrix3(qp),fromReference:r=>r.applyMatrix3(Xp).convertLinearToSRGB()}},P_=new Set([Wn,pa]),se={enabled:!0,_workingColorSpace:Wn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(r){if(!P_.has(r))throw new Error(`Unsupported working color space, "${r}".`);this._workingColorSpace=r},convert:function(r,t,e){if(this.enabled===!1||t===e||!t||!e)return r;let n=Ia[t].toReference,i=Ia[e].fromReference;return i(n(r))},fromWorkingColorSpace:function(r,t){return this.convert(r,this._workingColorSpace,t)},toWorkingColorSpace:function(r,t){return this.convert(r,t,this._workingColorSpace)},getPrimaries:function(r){return Ia[r].primaries},getTransfer:function(r){return r===li?Po:Ia[r].transfer}};function us(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function wh(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}var zr,Qc=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{zr===void 0&&(zr=Uo("canvas")),zr.width=t.width,zr.height=t.height;let n=zr.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=zr}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Uo("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=us(s[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(us(e[n]/255)*255):e[n]=us(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},D_=0,Bn=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:D_++}),this.uuid=Mn(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(Ah(i[o].image)):s.push(Ah(i[o]))}else s=Ah(i);n.url=s}return e||(t.images[this.uuid]=n),n}};function Ah(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Qc.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var L_=0,Be=class r extends Vn{constructor(t=r.DEFAULT_IMAGE,e=r.DEFAULT_MAPPING,n=ge,i=ge,s=Qt,o=Zn,a=Lt,c=cn,l=r.DEFAULT_ANISOTROPY,h=li){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:L_++}),this.uuid=Mn(),this.name="",this.source=new Bn(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new X(0,0),this.repeat=new X(1,1),this.center=new X(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==ru)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case $e:t.x=t.x-Math.floor(t.x);break;case ge:t.x=t.x<0?0:1;break;case Ro:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case $e:t.y=t.y-Math.floor(t.y);break;case ge:t.y=t.y<0?0:1;break;case Ro:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Be.DEFAULT_IMAGE=null;Be.DEFAULT_MAPPING=ru;Be.DEFAULT_ANISOTROPY=1;var Kt=class r{constructor(t=0,e=0,n=0,i=1){r.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s,c=t.elements,l=c[0],h=c[4],f=c[8],u=c[1],d=c[5],g=c[9],x=c[2],p=c[6],m=c[10];if(Math.abs(h-u)<.01&&Math.abs(f-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+x)<.1&&Math.abs(g+p)<.1&&Math.abs(l+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let v=(l+1)/2,y=(d+1)/2,w=(m+1)/2,S=(h+u)/4,T=(f+x)/4,A=(g+p)/4;return v>y&&v>w?v<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(v),i=S/n,s=T/n):y>w?y<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(y),n=S/i,s=A/i):w<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(w),n=T/s,i=A/s),this.set(n,i,s,e),this}let _=Math.sqrt((p-g)*(p-g)+(f-x)*(f-x)+(u-h)*(u-h));return Math.abs(_)<.001&&(_=1),this.x=(p-g)/_,this.y=(f-x)/_,this.z=(u-h)/_,this.w=Math.acos((l+d+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},jc=class extends Vn{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Kt(0,0,t,e),this.scissorTest=!1,this.viewport=new Kt(0,0,t,e);let i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Qt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);let s=new Be(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);s.flipY=!1,s.generateMipmaps=n.generateMipmaps,s.internalFormat=n.internalFormat,this.textures=[];let o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Bn(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},be=class extends jc{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Pi=class extends Be{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=ge,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}},Bo=class extends be{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new Pi(null,t,e,n),this.texture.isRenderTargetTexture=!0}},Oo=class extends Be{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Nt,this.minFilter=Nt,this.wrapR=ge,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},gf=class extends be{constructor(t=1,e=1,n=1,i={}){super(t,e,i),this.isWebGL3DRenderTarget=!0,this.depth=n,this.texture=new Oo(null,t,e,n),this.texture.isRenderTargetTexture=!0}},Ge=class{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],f=n[i+3],u=s[o+0],d=s[o+1],g=s[o+2],x=s[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f;return}if(a===1){t[e+0]=u,t[e+1]=d,t[e+2]=g,t[e+3]=x;return}if(f!==x||c!==u||l!==d||h!==g){let p=1-a,m=c*u+l*d+h*g+f*x,_=m>=0?1:-1,v=1-m*m;if(v>Number.EPSILON){let w=Math.sqrt(v),S=Math.atan2(w,m*_);p=Math.sin(p*S)/w,a=Math.sin(a*S)/w}let y=a*_;if(c=c*p+u*y,l=l*p+d*y,h=h*p+g*y,f=f*p+x*y,p===1-a){let w=1/Math.sqrt(c*c+l*l+h*h+f*f);c*=w,l*=w,h*=w,f*=w}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,i,s,o){let a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],f=s[o],u=s[o+1],d=s[o+2],g=s[o+3];return t[e]=a*g+h*f+c*d-l*u,t[e+1]=c*g+h*u+l*f-a*d,t[e+2]=l*g+h*d+a*u-c*f,t[e+3]=h*g-a*f-c*u-l*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,i=t._y,s=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),f=a(s/2),u=c(n/2),d=c(i/2),g=c(s/2);switch(o){case"XYZ":this._x=u*h*f+l*d*g,this._y=l*d*f-u*h*g,this._z=l*h*g+u*d*f,this._w=l*h*f-u*d*g;break;case"YXZ":this._x=u*h*f+l*d*g,this._y=l*d*f-u*h*g,this._z=l*h*g-u*d*f,this._w=l*h*f+u*d*g;break;case"ZXY":this._x=u*h*f-l*d*g,this._y=l*d*f+u*h*g,this._z=l*h*g+u*d*f,this._w=l*h*f-u*d*g;break;case"ZYX":this._x=u*h*f-l*d*g,this._y=l*d*f+u*h*g,this._z=l*h*g-u*d*f,this._w=l*h*f+u*d*g;break;case"YZX":this._x=u*h*f+l*d*g,this._y=l*d*f+u*h*g,this._z=l*h*g-u*d*f,this._w=l*h*f-u*d*g;break;case"XZY":this._x=u*h*f-l*d*g,this._y=l*d*f-u*h*g,this._z=l*h*g+u*d*f,this._w=l*h*f+u*d*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],i=e[4],s=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],f=e[10],u=n+a+f;if(u>0){let d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-c)*d,this._y=(s-l)*d,this._z=(o-i)*d}else if(n>a&&n>f){let d=2*Math.sqrt(1+n-a-f);this._w=(h-c)/d,this._x=.25*d,this._y=(i+o)/d,this._z=(s+l)/d}else if(a>f){let d=2*Math.sqrt(1+a-n-f);this._w=(s-l)/d,this._x=(i+o)/d,this._y=.25*d,this._z=(c+h)/d}else{let d=2*Math.sqrt(1+f-n-a);this._w=(o-i)/d,this._x=(s+l)/d,this._y=(c+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ae(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,i=t._y,s=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+i*l-s*c,this._y=i*h+o*c+s*a-n*l,this._z=s*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,i=this._y,s=this._z,o=this._w,a=o*t._w+n*t._x+i*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=s,this;let c=1-a*a;if(c<=Number.EPSILON){let d=1-e;return this._w=d*o+e*this._w,this._x=d*n+e*this._x,this._y=d*i+e*this._y,this._z=d*s+e*this._z,this.normalize(),this}let l=Math.sqrt(c),h=Math.atan2(l,a),f=Math.sin((1-e)*h)/l,u=Math.sin(e*h)/l;return this._w=o*f+this._w*u,this._x=n*f+this._x*u,this._y=i*f+this._y*u,this._z=s*f+this._z*u,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R=class r{constructor(t=0,e=0,n=0){r.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Yp.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Yp.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,i=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(t){let e=this.x,n=this.y,i=this.z,s=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*i-a*n),h=2*(a*e-s*i),f=2*(s*n-o*e);return this.x=e+c*l+o*f-a*h,this.y=n+c*h+a*l-s*f,this.z=i+c*f+s*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,i=t.y,s=t.z,o=e.x,a=e.y,c=e.z;return this.x=i*c-s*a,this.y=s*o-n*c,this.z=n*a-i*o,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Eh.copy(this).projectOnVector(t),this.sub(Eh)}reflect(t){return this.sub(Eh.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ae(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Eh=new R,Yp=new Ge,re=class{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ln.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ln.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Ln.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Ln):Ln.fromBufferAttribute(s,o),Ln.applyMatrix4(t.matrixWorld),this.expandByPoint(Ln);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Pa.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Pa.copy(n.boundingBox)),Pa.applyMatrix4(t.matrixWorld),this.union(Pa)}let i=t.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Ln),Ln.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(to),Da.subVectors(this.max,to),kr.subVectors(t.a,to),Vr.subVectors(t.b,to),Hr.subVectors(t.c,to),_i.subVectors(Vr,kr),yi.subVectors(Hr,Vr),Zi.subVectors(kr,Hr);let e=[0,-_i.z,_i.y,0,-yi.z,yi.y,0,-Zi.z,Zi.y,_i.z,0,-_i.x,yi.z,0,-yi.x,Zi.z,0,-Zi.x,-_i.y,_i.x,0,-yi.y,yi.x,0,-Zi.y,Zi.x,0];return!Rh(e,kr,Vr,Hr,Da)||(e=[1,0,0,0,1,0,0,0,1],!Rh(e,kr,Vr,Hr,Da))?!1:(La.crossVectors(_i,yi),e=[La.x,La.y,La.z],Rh(e,kr,Vr,Hr,Da))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ln).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ln).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(ii[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),ii[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),ii[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),ii[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),ii[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),ii[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),ii[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),ii[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(ii),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},ii=[new R,new R,new R,new R,new R,new R,new R,new R],Ln=new R,Pa=new re,kr=new R,Vr=new R,Hr=new R,_i=new R,yi=new R,Zi=new R,to=new R,Da=new R,La=new R,Ji=new R;function Rh(r,t,e,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){Ji.fromArray(r,s);let a=i.x*Math.abs(Ji.x)+i.y*Math.abs(Ji.y)+i.z*Math.abs(Ji.z),c=t.dot(Ji),l=e.dot(Ji),h=n.dot(Ji);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}var F_=new re,eo=new R,Ch=new R,Ue=class{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):F_.setFromPoints(t).getCenter(n);let i=0;for(let s=0,o=t.length;s<o;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;eo.subVectors(t,this.center);let e=eo.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(eo,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ch.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(eo.copy(t.center).add(Ch)),this.expandByPoint(eo.copy(t.center).sub(Ch))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},ri=new R,Ih=new R,Fa=new R,bi=new R,Ph=new R,Na=new R,Dh=new R,Di=class{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,ri)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=ri.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(ri.copy(this.origin).addScaledVector(this.direction,e),ri.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Ih.copy(t).add(e).multiplyScalar(.5),Fa.copy(e).sub(t).normalize(),bi.copy(this.origin).sub(Ih);let s=t.distanceTo(e)*.5,o=-this.direction.dot(Fa),a=bi.dot(this.direction),c=-bi.dot(Fa),l=bi.lengthSq(),h=Math.abs(1-o*o),f,u,d,g;if(h>0)if(f=o*c-a,u=o*a-c,g=s*h,f>=0)if(u>=-g)if(u<=g){let x=1/h;f*=x,u*=x,d=f*(f+o*u+2*a)+u*(o*f+u+2*c)+l}else u=s,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*c)+l;else u=-s,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*c)+l;else u<=-g?(f=Math.max(0,-(-o*s+a)),u=f>0?-s:Math.min(Math.max(-s,-c),s),d=-f*f+u*(u+2*c)+l):u<=g?(f=0,u=Math.min(Math.max(-s,-c),s),d=u*(u+2*c)+l):(f=Math.max(0,-(o*s+a)),u=f>0?s:Math.min(Math.max(-s,-c),s),d=-f*f+u*(u+2*c)+l);else u=o>0?-s:s,f=Math.max(0,-(o*u+a)),d=-f*f+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),i&&i.copy(Ih).addScaledVector(Fa,u),d}intersectSphere(t,e){ri.subVectors(t.center,this.origin);let n=ri.dot(this.direction),i=ri.dot(ri)-n*n,s=t.radius*t.radius;if(i>s)return null;let o=Math.sqrt(s-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,o,a,c,l=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return l>=0?(n=(t.min.x-u.x)*l,i=(t.max.x-u.x)*l):(n=(t.max.x-u.x)*l,i=(t.min.x-u.x)*l),h>=0?(s=(t.min.y-u.y)*h,o=(t.max.y-u.y)*h):(s=(t.max.y-u.y)*h,o=(t.min.y-u.y)*h),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),f>=0?(a=(t.min.z-u.z)*f,c=(t.max.z-u.z)*f):(a=(t.max.z-u.z)*f,c=(t.min.z-u.z)*f),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,ri)!==null}intersectTriangle(t,e,n,i,s){Ph.subVectors(e,t),Na.subVectors(n,t),Dh.crossVectors(Ph,Na);let o=this.direction.dot(Dh),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;bi.subVectors(this.origin,t);let c=a*this.direction.dot(Na.crossVectors(bi,Na));if(c<0)return null;let l=a*this.direction.dot(Ph.cross(bi));if(l<0||c+l>o)return null;let h=-a*bi.dot(Dh);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},dt=class r{constructor(t,e,n,i,s,o,a,c,l,h,f,u,d,g,x,p){r.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,c,l,h,f,u,d,g,x,p)}set(t,e,n,i,s,o,a,c,l,h,f,u,d,g,x,p){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=i,m[1]=s,m[5]=o,m[9]=a,m[13]=c,m[2]=l,m[6]=h,m[10]=f,m[14]=u,m[3]=d,m[7]=g,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new r().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,i=1/Gr.setFromMatrixColumn(t,0).length(),s=1/Gr.setFromMatrixColumn(t,1).length(),o=1/Gr.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,i=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){let u=o*h,d=o*f,g=a*h,x=a*f;e[0]=c*h,e[4]=-c*f,e[8]=l,e[1]=d+g*l,e[5]=u-x*l,e[9]=-a*c,e[2]=x-u*l,e[6]=g+d*l,e[10]=o*c}else if(t.order==="YXZ"){let u=c*h,d=c*f,g=l*h,x=l*f;e[0]=u+x*a,e[4]=g*a-d,e[8]=o*l,e[1]=o*f,e[5]=o*h,e[9]=-a,e[2]=d*a-g,e[6]=x+u*a,e[10]=o*c}else if(t.order==="ZXY"){let u=c*h,d=c*f,g=l*h,x=l*f;e[0]=u-x*a,e[4]=-o*f,e[8]=g+d*a,e[1]=d+g*a,e[5]=o*h,e[9]=x-u*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){let u=o*h,d=o*f,g=a*h,x=a*f;e[0]=c*h,e[4]=g*l-d,e[8]=u*l+x,e[1]=c*f,e[5]=x*l+u,e[9]=d*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){let u=o*c,d=o*l,g=a*c,x=a*l;e[0]=c*h,e[4]=x-u*f,e[8]=g*f+d,e[1]=f,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=d*f+g,e[10]=u-x*f}else if(t.order==="XZY"){let u=o*c,d=o*l,g=a*c,x=a*l;e[0]=c*h,e[4]=-f,e[8]=l*h,e[1]=u*f+x,e[5]=o*h,e[9]=d*f-g,e[2]=g*f-d,e[6]=a*h,e[10]=x*f+u}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(N_,t,U_)}lookAt(t,e,n){let i=this.elements;return yn.subVectors(t,e),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),Mi.crossVectors(n,yn),Mi.lengthSq()===0&&(Math.abs(n.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),Mi.crossVectors(n,yn)),Mi.normalize(),Ua.crossVectors(yn,Mi),i[0]=Mi.x,i[4]=Ua.x,i[8]=yn.x,i[1]=Mi.y,i[5]=Ua.y,i[9]=yn.y,i[2]=Mi.z,i[6]=Ua.z,i[10]=yn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],f=n[5],u=n[9],d=n[13],g=n[2],x=n[6],p=n[10],m=n[14],_=n[3],v=n[7],y=n[11],w=n[15],S=i[0],T=i[4],A=i[8],M=i[12],b=i[1],I=i[5],D=i[9],F=i[13],N=i[2],k=i[6],U=i[10],$=i[14],W=i[3],st=i[7],lt=i[11],gt=i[15];return s[0]=o*S+a*b+c*N+l*W,s[4]=o*T+a*I+c*k+l*st,s[8]=o*A+a*D+c*U+l*lt,s[12]=o*M+a*F+c*$+l*gt,s[1]=h*S+f*b+u*N+d*W,s[5]=h*T+f*I+u*k+d*st,s[9]=h*A+f*D+u*U+d*lt,s[13]=h*M+f*F+u*$+d*gt,s[2]=g*S+x*b+p*N+m*W,s[6]=g*T+x*I+p*k+m*st,s[10]=g*A+x*D+p*U+m*lt,s[14]=g*M+x*F+p*$+m*gt,s[3]=_*S+v*b+y*N+w*W,s[7]=_*T+v*I+y*k+w*st,s[11]=_*A+v*D+y*U+w*lt,s[15]=_*M+v*F+y*$+w*gt,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],f=t[6],u=t[10],d=t[14],g=t[3],x=t[7],p=t[11],m=t[15];return g*(+s*c*f-i*l*f-s*a*u+n*l*u+i*a*d-n*c*d)+x*(+e*c*d-e*l*u+s*o*u-i*o*d+i*l*h-s*c*h)+p*(+e*l*f-e*a*d-s*o*f+n*o*d+s*a*h-n*l*h)+m*(-i*a*h-e*c*f+e*a*u+i*o*f-n*o*u+n*c*h)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],f=t[9],u=t[10],d=t[11],g=t[12],x=t[13],p=t[14],m=t[15],_=f*p*l-x*u*l+x*c*d-a*p*d-f*c*m+a*u*m,v=g*u*l-h*p*l-g*c*d+o*p*d+h*c*m-o*u*m,y=h*x*l-g*f*l+g*a*d-o*x*d-h*a*m+o*f*m,w=g*f*c-h*x*c-g*a*u+o*x*u+h*a*p-o*f*p,S=e*_+n*v+i*y+s*w;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let T=1/S;return t[0]=_*T,t[1]=(x*u*s-f*p*s-x*i*d+n*p*d+f*i*m-n*u*m)*T,t[2]=(a*p*s-x*c*s+x*i*l-n*p*l-a*i*m+n*c*m)*T,t[3]=(f*c*s-a*u*s-f*i*l+n*u*l+a*i*d-n*c*d)*T,t[4]=v*T,t[5]=(h*p*s-g*u*s+g*i*d-e*p*d-h*i*m+e*u*m)*T,t[6]=(g*c*s-o*p*s-g*i*l+e*p*l+o*i*m-e*c*m)*T,t[7]=(o*u*s-h*c*s+h*i*l-e*u*l-o*i*d+e*c*d)*T,t[8]=y*T,t[9]=(g*f*s-h*x*s-g*n*d+e*x*d+h*n*m-e*f*m)*T,t[10]=(o*x*s-g*a*s+g*n*l-e*x*l-o*n*m+e*a*m)*T,t[11]=(h*a*s-o*f*s-h*n*l+e*f*l+o*n*d-e*a*d)*T,t[12]=w*T,t[13]=(h*x*i-g*f*i+g*n*u-e*x*u-h*n*p+e*f*p)*T,t[14]=(g*a*i-o*x*i-g*n*c+e*x*c+o*n*p-e*a*p)*T,t[15]=(o*f*i-h*a*i+h*n*c-e*f*c-o*n*u+e*a*u)*T,this}scale(t){let e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),i=Math.sin(e),s=1-n,o=t.x,a=t.y,c=t.z,l=s*o,h=s*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,o){return this.set(1,n,s,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){let i=this.elements,s=e._x,o=e._y,a=e._z,c=e._w,l=s+s,h=o+o,f=a+a,u=s*l,d=s*h,g=s*f,x=o*h,p=o*f,m=a*f,_=c*l,v=c*h,y=c*f,w=n.x,S=n.y,T=n.z;return i[0]=(1-(x+m))*w,i[1]=(d+y)*w,i[2]=(g-v)*w,i[3]=0,i[4]=(d-y)*S,i[5]=(1-(u+m))*S,i[6]=(p+_)*S,i[7]=0,i[8]=(g+v)*T,i[9]=(p-_)*T,i[10]=(1-(u+x))*T,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){let i=this.elements,s=Gr.set(i[0],i[1],i[2]).length(),o=Gr.set(i[4],i[5],i[6]).length(),a=Gr.set(i[8],i[9],i[10]).length();this.determinant()<0&&(s=-s),t.x=i[12],t.y=i[13],t.z=i[14],Fn.copy(this);let l=1/s,h=1/o,f=1/a;return Fn.elements[0]*=l,Fn.elements[1]*=l,Fn.elements[2]*=l,Fn.elements[4]*=h,Fn.elements[5]*=h,Fn.elements[6]*=h,Fn.elements[8]*=f,Fn.elements[9]*=f,Fn.elements[10]*=f,e.setFromRotationMatrix(Fn),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,i,s,o,a=Jn){let c=this.elements,l=2*s/(e-t),h=2*s/(n-i),f=(e+t)/(e-t),u=(n+i)/(n-i),d,g;if(a===Jn)d=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===No)d=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=h,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,s,o,a=Jn){let c=this.elements,l=1/(e-t),h=1/(n-i),f=1/(o-s),u=(e+t)*l,d=(n+i)*h,g,x;if(a===Jn)g=(o+s)*f,x=-2*f;else if(a===No)g=s*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=x,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Gr=new R,Fn=new dt,N_=new R(0,0,0),U_=new R(1,1,1),Mi=new R,Ua=new R,yn=new R,$p=new dt,Zp=new Ge,Sn=class r{constructor(t=0,e=0,n=0,i=r.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let i=t.elements,s=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],f=i[2],u=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(Ae(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Ae(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Ae(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Ae(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(Ae(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Ae(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return $p.makeRotationFromQuaternion(t),this.setFromRotationMatrix($p,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Zp.setFromEuler(this),this.setFromQuaternion(Zp,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Sn.DEFAULT_ORDER="XYZ";var ds=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},B_=0,Jp=new R,Wr=new Ge,si=new dt,Ba=new R,no=new R,O_=new R,z_=new Ge,Kp=new R(1,0,0),Qp=new R(0,1,0),jp=new R(0,0,1),tm={type:"added"},k_={type:"removed"},Xr={type:"childadded",child:null},Lh={type:"childremoved",child:null},oe=class r extends Vn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:B_++}),this.uuid=Mn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=r.DEFAULT_UP.clone();let t=new R,e=new Sn,n=new Ge,i=new R(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new dt},normalMatrix:{value:new Ht}}),this.matrix=new dt,this.matrixWorld=new dt,this.matrixAutoUpdate=r.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=r.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ds,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Wr.setFromAxisAngle(t,e),this.quaternion.multiply(Wr),this}rotateOnWorldAxis(t,e){return Wr.setFromAxisAngle(t,e),this.quaternion.premultiply(Wr),this}rotateX(t){return this.rotateOnAxis(Kp,t)}rotateY(t){return this.rotateOnAxis(Qp,t)}rotateZ(t){return this.rotateOnAxis(jp,t)}translateOnAxis(t,e){return Jp.copy(t).applyQuaternion(this.quaternion),this.position.add(Jp.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Kp,t)}translateY(t){return this.translateOnAxis(Qp,t)}translateZ(t){return this.translateOnAxis(jp,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(si.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Ba.copy(t):Ba.set(t,e,n);let i=this.parent;this.updateWorldMatrix(!0,!1),no.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?si.lookAt(no,Ba,this.up):si.lookAt(Ba,no,this.up),this.quaternion.setFromRotationMatrix(si),i&&(si.extractRotation(i.matrixWorld),Wr.setFromRotationMatrix(si),this.quaternion.premultiply(Wr.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(tm),Xr.child=t,this.dispatchEvent(Xr),Xr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(k_),Lh.child=t,this.dispatchEvent(Lh),Lh.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),si.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),si.multiply(t.parent.matrixWorld)),t.applyMatrix4(si),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(tm),Xr.child=t,this.dispatchEvent(Xr),Xr.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){let o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(no,t,O_),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(no,z_,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){let i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){let f=c[l];s(t.shapes,f)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(t.materials,this.material[c]));i.material=a}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let c=this.animations[a];i.animations.push(s(t.animations,c))}}if(e){let a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),f=o(t.shapes),u=o(t.skeletons),d=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){let c=[];for(let l in a){let h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let i=t.children[n];this.add(i.clone())}return this}};oe.DEFAULT_UP=new R(0,1,0);oe.DEFAULT_MATRIX_AUTO_UPDATE=!0;oe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Nn=new R,oi=new R,Fh=new R,ai=new R,qr=new R,Yr=new R,em=new R,Nh=new R,Uh=new R,Bh=new R,en=class r{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Nn.subVectors(t,e),i.cross(Nn);let s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){Nn.subVectors(i,e),oi.subVectors(n,e),Fh.subVectors(t,e);let o=Nn.dot(Nn),a=Nn.dot(oi),c=Nn.dot(Fh),l=oi.dot(oi),h=oi.dot(Fh),f=o*l-a*a;if(f===0)return s.set(0,0,0),null;let u=1/f,d=(l*c-a*h)*u,g=(o*h-a*c)*u;return s.set(1-d-g,g,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,ai)===null?!1:ai.x>=0&&ai.y>=0&&ai.x+ai.y<=1}static getInterpolation(t,e,n,i,s,o,a,c){return this.getBarycoord(t,e,n,i,ai)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,ai.x),c.addScaledVector(o,ai.y),c.addScaledVector(a,ai.z),c)}static isFrontFacing(t,e,n,i){return Nn.subVectors(n,e),oi.subVectors(t,e),Nn.cross(oi).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Nn.subVectors(this.c,this.b),oi.subVectors(this.a,this.b),Nn.cross(oi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return r.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return r.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return r.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return r.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return r.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,i=this.b,s=this.c,o,a;qr.subVectors(i,n),Yr.subVectors(s,n),Nh.subVectors(t,n);let c=qr.dot(Nh),l=Yr.dot(Nh);if(c<=0&&l<=0)return e.copy(n);Uh.subVectors(t,i);let h=qr.dot(Uh),f=Yr.dot(Uh);if(h>=0&&f<=h)return e.copy(i);let u=c*f-h*l;if(u<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(qr,o);Bh.subVectors(t,s);let d=qr.dot(Bh),g=Yr.dot(Bh);if(g>=0&&d<=g)return e.copy(s);let x=d*l-c*g;if(x<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(Yr,a);let p=h*g-d*f;if(p<=0&&f-h>=0&&d-g>=0)return em.subVectors(s,i),a=(f-h)/(f-h+(d-g)),e.copy(i).addScaledVector(em,a);let m=1/(p+x+u);return o=x*m,a=u*m,e.copy(n).addScaledVector(qr,o).addScaledVector(Yr,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},b0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Si={h:0,s:0,l:0},Oa={h:0,s:0,l:0};function Oh(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}var at=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Rn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,se.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=se.workingColorSpace){return this.r=t,this.g=e,this.b=n,se.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=se.workingColorSpace){if(t=Vd(t,1),e=Ae(e,0,1),n=Ae(n,0,1),e===0)this.r=this.g=this.b=n;else{let s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Oh(o,s,t+1/3),this.g=Oh(o,s,t),this.b=Oh(o,s,t-1/3)}return se.toWorkingColorSpace(this,i),this}setStyle(t,e=Rn){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s,o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){let s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Rn){let n=b0[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=us(t.r),this.g=us(t.g),this.b=us(t.b),this}copyLinearToSRGB(t){return this.r=wh(t.r),this.g=wh(t.g),this.b=wh(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Rn){return se.fromWorkingColorSpace(je.copy(this),t),Math.round(Ae(je.r*255,0,255))*65536+Math.round(Ae(je.g*255,0,255))*256+Math.round(Ae(je.b*255,0,255))}getHexString(t=Rn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=se.workingColorSpace){se.fromWorkingColorSpace(je.copy(this),e);let n=je.r,i=je.g,s=je.b,o=Math.max(n,i,s),a=Math.min(n,i,s),c,l,h=(a+o)/2;if(a===o)c=0,l=0;else{let f=o-a;switch(l=h<=.5?f/(o+a):f/(2-o-a),o){case n:c=(i-s)/f+(i<s?6:0);break;case i:c=(s-n)/f+2;break;case s:c=(n-i)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=se.workingColorSpace){return se.fromWorkingColorSpace(je.copy(this),e),t.r=je.r,t.g=je.g,t.b=je.b,t}getStyle(t=Rn){se.fromWorkingColorSpace(je.copy(this),t);let e=je.r,n=je.g,i=je.b;return t!==Rn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Si),this.setHSL(Si.h+t,Si.s+e,Si.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Si),t.getHSL(Oa);let n=bo(Si.h,Oa.h,e),i=bo(Si.s,Oa.s,e),s=bo(Si.l,Oa.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},je=new at;at.NAMES=b0;var V_=0,We=class extends Vn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:V_++}),this.uuid=Mn(),this.name="",this.type="Material",this.blending=On,this.side=pn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sc,this.blendDst=Tc,this.blendEquation=Ei,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new at(0,0,0),this.blendAlpha=0,this.depthFunc=Ao,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pf,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ar,this.stencilZFail=ar,this.stencilZPass=ar,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==On&&(n.blending=this.blending),this.side!==pn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Sc&&(n.blendSrc=this.blendSrc),this.blendDst!==Tc&&(n.blendDst=this.blendDst),this.blendEquation!==Ei&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ao&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==pf&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ar&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ar&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ar&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){let o=[];for(let a in s){let c=s[a];delete c.metadata,o.push(c)}return o}if(e){let s=i(t.textures),o=i(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}},mn=class extends We{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new at(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=fa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},ui=H_();function H_(){let r=new ArrayBuffer(4),t=new Float32Array(r),e=new Uint32Array(r),n=new Uint32Array(512),i=new Uint32Array(512);for(let c=0;c<256;++c){let l=c-127;l<-27?(n[c]=0,n[c|256]=32768,i[c]=24,i[c|256]=24):l<-14?(n[c]=1024>>-l-14,n[c|256]=1024>>-l-14|32768,i[c]=-l-1,i[c|256]=-l-1):l<=15?(n[c]=l+15<<10,n[c|256]=l+15<<10|32768,i[c]=13,i[c|256]=13):l<128?(n[c]=31744,n[c|256]=64512,i[c]=24,i[c|256]=24):(n[c]=31744,n[c|256]=64512,i[c]=13,i[c|256]=13)}let s=new Uint32Array(2048),o=new Uint32Array(64),a=new Uint32Array(64);for(let c=1;c<1024;++c){let l=c<<13,h=0;for(;!(l&8388608);)l<<=1,h-=8388608;l&=-8388609,h+=947912704,s[c]=l|h}for(let c=1024;c<2048;++c)s[c]=939524096+(c-1024<<13);for(let c=1;c<31;++c)o[c]=c<<23;o[31]=1199570944,o[32]=2147483648;for(let c=33;c<63;++c)o[c]=2147483648+(c-32<<23);o[63]=3347054592;for(let c=1;c<64;++c)c!==32&&(a[c]=1024);return{floatView:t,uint32View:e,baseTable:n,shiftTable:i,mantissaTable:s,exponentTable:o,offsetTable:a}}function hn(r){Math.abs(r)>65504&&console.warn("THREE.DataUtils.toHalfFloat(): Value out of range."),r=Ae(r,-65504,65504),ui.floatView[0]=r;let t=ui.uint32View[0],e=t>>23&511;return ui.baseTable[e]+((t&8388607)>>ui.shiftTable[e])}function fo(r){let t=r>>10;return ui.uint32View[0]=ui.mantissaTable[ui.offsetTable[t]+(r&1023)]+ui.exponentTable[t],ui.floatView[0]}var Oe={toHalfFloat:hn,fromHalfFloat:fo},Fe=new R,za=new X,Ft=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Fo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Dt,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return Hd("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)za.fromBufferAttribute(this,e),za.applyMatrix3(t),this.setXY(e,za.x,za.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix3(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyMatrix4(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.applyNormalMatrix(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Fe.fromBufferAttribute(this,e),Fe.transformDirection(t),this.setXYZ(e,Fe.x,Fe.y,Fe.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=an(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Xt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=an(e,this.array)),e}setX(t,e){return this.normalized&&(e=Xt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=an(e,this.array)),e}setY(t,e){return this.normalized&&(e=Xt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=an(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Xt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=an(e,this.array)),e}setW(t,e){return this.normalized&&(e=Xt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Xt(e,this.array),n=Xt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Xt(e,this.array),n=Xt(n,this.array),i=Xt(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=Xt(e,this.array),n=Xt(n,this.array),i=Xt(i,this.array),s=Xt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Fo&&(t.usage=this.usage),t}},xf=class extends Ft{constructor(t,e,n){super(new Int8Array(t),e,n)}},vf=class extends Ft{constructor(t,e,n){super(new Uint8Array(t),e,n)}},_f=class extends Ft{constructor(t,e,n){super(new Uint8ClampedArray(t),e,n)}},yf=class extends Ft{constructor(t,e,n){super(new Int16Array(t),e,n)}},zo=class extends Ft{constructor(t,e,n){super(new Uint16Array(t),e,n)}},bf=class extends Ft{constructor(t,e,n){super(new Int32Array(t),e,n)}},ko=class extends Ft{constructor(t,e,n){super(new Uint32Array(t),e,n)}},Mf=class extends Ft{constructor(t,e,n){super(new Uint16Array(t),e,n),this.isFloat16BufferAttribute=!0}getX(t){let e=fo(this.array[t*this.itemSize]);return this.normalized&&(e=an(e,this.array)),e}setX(t,e){return this.normalized&&(e=Xt(e,this.array)),this.array[t*this.itemSize]=hn(e),this}getY(t){let e=fo(this.array[t*this.itemSize+1]);return this.normalized&&(e=an(e,this.array)),e}setY(t,e){return this.normalized&&(e=Xt(e,this.array)),this.array[t*this.itemSize+1]=hn(e),this}getZ(t){let e=fo(this.array[t*this.itemSize+2]);return this.normalized&&(e=an(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Xt(e,this.array)),this.array[t*this.itemSize+2]=hn(e),this}getW(t){let e=fo(this.array[t*this.itemSize+3]);return this.normalized&&(e=an(e,this.array)),e}setW(t,e){return this.normalized&&(e=Xt(e,this.array)),this.array[t*this.itemSize+3]=hn(e),this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Xt(e,this.array),n=Xt(n,this.array)),this.array[t+0]=hn(e),this.array[t+1]=hn(n),this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Xt(e,this.array),n=Xt(n,this.array),i=Xt(i,this.array)),this.array[t+0]=hn(e),this.array[t+1]=hn(n),this.array[t+2]=hn(i),this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=Xt(e,this.array),n=Xt(n,this.array),i=Xt(i,this.array),s=Xt(s,this.array)),this.array[t+0]=hn(e),this.array[t+1]=hn(n),this.array[t+2]=hn(i),this.array[t+3]=hn(s),this}},yt=class extends Ft{constructor(t,e,n){super(new Float32Array(t),e,n)}},G_=0,En=new dt,zh=new oe,$r=new R,bn=new re,io=new re,He=new R,Rt=class r extends Vn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:G_++}),this.uuid=Mn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(_0(t)?ko:zo)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let s=new Ht().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return En.makeRotationFromQuaternion(t),this.applyMatrix4(En),this}rotateX(t){return En.makeRotationX(t),this.applyMatrix4(En),this}rotateY(t){return En.makeRotationY(t),this.applyMatrix4(En),this}rotateZ(t){return En.makeRotationZ(t),this.applyMatrix4(En),this}translate(t,e,n){return En.makeTranslation(t,e,n),this.applyMatrix4(En),this}scale(t,e,n){return En.makeScale(t,e,n),this.applyMatrix4(En),this}lookAt(t){return zh.lookAt(t),zh.updateMatrix(),this.applyMatrix4(zh.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter($r).negate(),this.translate($r.x,$r.y,$r.z),this}setFromPoints(t){let e=[];for(let n=0,i=t.length;n<i;n++){let s=t[n];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new yt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new re);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){let s=e[n];bn.setFromBufferAttribute(s),this.morphTargetsRelative?(He.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(He),He.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(He)):(this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ue);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new R,1/0);return}if(t){let n=this.boundingSphere.center;if(bn.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){let a=e[s];io.setFromBufferAttribute(a),this.morphTargetsRelative?(He.addVectors(bn.min,io.min),bn.expandByPoint(He),He.addVectors(bn.max,io.max),bn.expandByPoint(He)):(bn.expandByPoint(io.min),bn.expandByPoint(io.max))}bn.getCenter(n);let i=0;for(let s=0,o=t.count;s<o;s++)He.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(He));if(e)for(let s=0,o=e.length;s<o;s++){let a=e[s],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)He.fromBufferAttribute(a,l),c&&($r.fromBufferAttribute(t,l),He.add($r)),i=Math.max(i,n.distanceToSquared(He))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,i=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ft(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),a=[],c=[];for(let A=0;A<n.count;A++)a[A]=new R,c[A]=new R;let l=new R,h=new R,f=new R,u=new X,d=new X,g=new X,x=new R,p=new R;function m(A,M,b){l.fromBufferAttribute(n,A),h.fromBufferAttribute(n,M),f.fromBufferAttribute(n,b),u.fromBufferAttribute(s,A),d.fromBufferAttribute(s,M),g.fromBufferAttribute(s,b),h.sub(l),f.sub(l),d.sub(u),g.sub(u);let I=1/(d.x*g.y-g.x*d.y);isFinite(I)&&(x.copy(h).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(I),p.copy(f).multiplyScalar(d.x).addScaledVector(h,-g.x).multiplyScalar(I),a[A].add(x),a[M].add(x),a[b].add(x),c[A].add(p),c[M].add(p),c[b].add(p))}let _=this.groups;_.length===0&&(_=[{start:0,count:t.count}]);for(let A=0,M=_.length;A<M;++A){let b=_[A],I=b.start,D=b.count;for(let F=I,N=I+D;F<N;F+=3)m(t.getX(F+0),t.getX(F+1),t.getX(F+2))}let v=new R,y=new R,w=new R,S=new R;function T(A){w.fromBufferAttribute(i,A),S.copy(w);let M=a[A];v.copy(M),v.sub(w.multiplyScalar(w.dot(M))).normalize(),y.crossVectors(S,M);let I=y.dot(c[A])<0?-1:1;o.setXYZW(A,v.x,v.y,v.z,I)}for(let A=0,M=_.length;A<M;++A){let b=_[A],I=b.start,D=b.count;for(let F=I,N=I+D;F<N;F+=3)T(t.getX(F+0)),T(t.getX(F+1)),T(t.getX(F+2))}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ft(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);let i=new R,s=new R,o=new R,a=new R,c=new R,l=new R,h=new R,f=new R;if(t)for(let u=0,d=t.count;u<d;u+=3){let g=t.getX(u+0),x=t.getX(u+1),p=t.getX(u+2);i.fromBufferAttribute(e,g),s.fromBufferAttribute(e,x),o.fromBufferAttribute(e,p),h.subVectors(o,s),f.subVectors(i,s),h.cross(f),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let u=0,d=e.count;u<d;u+=3)i.fromBufferAttribute(e,u+0),s.fromBufferAttribute(e,u+1),o.fromBufferAttribute(e,u+2),h.subVectors(o,s),f.subVectors(i,s),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)He.fromBufferAttribute(t,e),He.normalize(),t.setXYZ(e,He.x,He.y,He.z)}toNonIndexed(){function t(a,c){let l=a.array,h=a.itemSize,f=a.normalized,u=new l.constructor(c.length*h),d=0,g=0;for(let x=0,p=c.length;x<p;x++){a.isInterleavedBufferAttribute?d=c[x]*a.data.stride+a.offset:d=c[x]*h;for(let m=0;m<h;m++)u[g++]=l[d++]}return new Ft(u,h,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new r,n=this.index.array,i=this.attributes;for(let a in i){let c=i[a],l=t(c,n);e.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let c=[],l=s[a];for(let h=0,f=l.length;h<f;h++){let u=l[h],d=t(u,n);c.push(d)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,c=o.length;a<c;a++){let l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let l=n[c];t.data.attributes[c]=l.toJSON(t.data)}let i={},s=!1;for(let c in this.morphAttributes){let l=this.morphAttributes[c],h=[];for(let f=0,u=l.length;f<u;f++){let d=l[f];h.push(d.toJSON(t.data))}h.length>0&&(i[c]=h,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let i=t.attributes;for(let l in i){let h=i[l];this.setAttribute(l,h.clone(e))}let s=t.morphAttributes;for(let l in s){let h=[],f=s[l];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;let o=t.groups;for(let l=0,h=o.length;l<h;l++){let f=o[l];this.addGroup(f.start,f.count,f.materialIndex)}let a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},nm=new dt,Ki=new Di,ka=new Ue,im=new R,Zr=new R,Jr=new R,Kr=new R,kh=new R,Va=new R,Ha=new X,Ga=new X,Wa=new X,rm=new R,sm=new R,om=new R,Xa=new R,qa=new R,Zt=class extends oe{constructor(t=new Rt,e=new mn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);let a=this.morphTargetInfluences;if(s&&a){Va.set(0,0,0);for(let c=0,l=s.length;c<l;c++){let h=a[c],f=s[c];h!==0&&(kh.fromBufferAttribute(f,t),o?Va.addScaledVector(kh,h):Va.addScaledVector(kh.sub(e),h))}e.add(Va)}return e}raycast(t,e){let n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ka.copy(n.boundingSphere),ka.applyMatrix4(s),Ki.copy(t.ray).recast(t.near),!(ka.containsPoint(Ki.origin)===!1&&(Ki.intersectSphere(ka,im)===null||Ki.origin.distanceToSquared(im)>(t.far-t.near)**2))&&(nm.copy(s).invert(),Ki.copy(t.ray).applyMatrix4(nm),!(n.boundingBox!==null&&Ki.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ki)))}_computeIntersections(t,e,n){let i,s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,f=s.attributes.normal,u=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){let p=u[g],m=o[p.materialIndex],_=Math.max(p.start,d.start),v=Math.min(a.count,Math.min(p.start+p.count,d.start+d.count));for(let y=_,w=v;y<w;y+=3){let S=a.getX(y),T=a.getX(y+1),A=a.getX(y+2);i=Ya(this,m,t,n,l,h,f,S,T,A),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{let g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){let _=a.getX(p),v=a.getX(p+1),y=a.getX(p+2);i=Ya(this,o,t,n,l,h,f,_,v,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,x=u.length;g<x;g++){let p=u[g],m=o[p.materialIndex],_=Math.max(p.start,d.start),v=Math.min(c.count,Math.min(p.start+p.count,d.start+d.count));for(let y=_,w=v;y<w;y+=3){let S=y,T=y+1,A=y+2;i=Ya(this,m,t,n,l,h,f,S,T,A),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{let g=Math.max(0,d.start),x=Math.min(c.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){let _=p,v=p+1,y=p+2;i=Ya(this,o,t,n,l,h,f,_,v,y),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}};function W_(r,t,e,n,i,s,o,a){let c;if(t.side===Ie?c=n.intersectTriangle(o,s,i,!0,a):c=n.intersectTriangle(i,s,o,t.side===pn,a),c===null)return null;qa.copy(a),qa.applyMatrix4(r.matrixWorld);let l=e.ray.origin.distanceTo(qa);return l<e.near||l>e.far?null:{distance:l,point:qa.clone(),object:r}}function Ya(r,t,e,n,i,s,o,a,c,l){r.getVertexPosition(a,Zr),r.getVertexPosition(c,Jr),r.getVertexPosition(l,Kr);let h=W_(r,t,e,n,Zr,Jr,Kr,Xa);if(h){i&&(Ha.fromBufferAttribute(i,a),Ga.fromBufferAttribute(i,c),Wa.fromBufferAttribute(i,l),h.uv=en.getInterpolation(Xa,Zr,Jr,Kr,Ha,Ga,Wa,new X)),s&&(Ha.fromBufferAttribute(s,a),Ga.fromBufferAttribute(s,c),Wa.fromBufferAttribute(s,l),h.uv1=en.getInterpolation(Xa,Zr,Jr,Kr,Ha,Ga,Wa,new X)),o&&(rm.fromBufferAttribute(o,a),sm.fromBufferAttribute(o,c),om.fromBufferAttribute(o,l),h.normal=en.getInterpolation(Xa,Zr,Jr,Kr,rm,sm,om,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let f={a,b:c,c:l,normal:new R,materialIndex:0};en.getNormal(Zr,Jr,Kr,f.normal),h.face=f}return h}var pi=class r extends Rt{constructor(t=1,e=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};let a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);let c=[],l=[],h=[],f=[],u=0,d=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,s,4),g("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(c),this.setAttribute("position",new yt(l,3)),this.setAttribute("normal",new yt(h,3)),this.setAttribute("uv",new yt(f,2));function g(x,p,m,_,v,y,w,S,T,A,M){let b=y/T,I=w/A,D=y/2,F=w/2,N=S/2,k=T+1,U=A+1,$=0,W=0,st=new R;for(let lt=0;lt<U;lt++){let gt=lt*I-F;for(let Pt=0;Pt<k;Pt++){let qt=Pt*b-D;st[x]=qt*_,st[p]=gt*v,st[m]=N,l.push(st.x,st.y,st.z),st[x]=0,st[p]=0,st[m]=S>0?1:-1,h.push(st.x,st.y,st.z),f.push(Pt/T),f.push(1-lt/A),$+=1}}for(let lt=0;lt<A;lt++)for(let gt=0;gt<T;gt++){let Pt=u+gt+k*lt,qt=u+gt+k*(lt+1),q=u+(gt+1)+k*(lt+1),et=u+(gt+1)+k*lt;c.push(Pt,qt,et),c.push(qt,q,et),W+=6}a.addGroup(d,W,M),d+=W,u+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function ps(r){let t={};for(let e in r){t[e]={};for(let n in r[e]){let i=r[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function on(r){let t={};for(let e=0;e<r.length;e++){let n=ps(r[e]);for(let i in n)t[i]=n[i]}return t}function X_(r){let t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function M0(r){let t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:se.workingColorSpace}var S0={clone:ps,merge:on},q_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Y_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Pe=class extends We{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=q_,this.fragmentShader=Y_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ps(t.uniforms),this.uniformsGroups=X_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},Li=class extends oe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new dt,this.projectionMatrix=new dt,this.projectionMatrixInverse=new dt,this.coordinateSystem=Jn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Ti=new R,am=new X,cm=new X,_e=class extends Li{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=fs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(pr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return fs*2*Math.atan(Math.tan(pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ti.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ti.x,Ti.y).multiplyScalar(-t/Ti.z),Ti.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ti.x,Ti.y).multiplyScalar(-t/Ti.z)}getViewSize(t,e){return this.getViewBounds(t,am,cm),e.subVectors(cm,am)}setViewOffset(t,e,n,i,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(pr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*i/c,e-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}let a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},Qr=-90,jr=1,tl=class extends oe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new _e(Qr,jr,t,e);i.layers=this.layers,this.add(i);let s=new _e(Qr,jr,t,e);s.layers=this.layers,this.add(s);let o=new _e(Qr,jr,t,e);o.layers=this.layers,this.add(o);let a=new _e(Qr,jr,t,e);a.layers=this.layers,this.add(a);let c=new _e(Qr,jr,t,e);c.layers=this.layers,this.add(c);let l=new _e(Qr,jr,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,i,s,o,a,c]=e;for(let l of e)this.remove(l);if(t===Jn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===No)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,c,l,h]=this.children,f=t.getRenderTarget(),u=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,s),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(f,u,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},xr=class extends Be{constructor(t,e,n,i,s,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:di,super(t,e,n,i,s,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},el=class extends be{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new xr(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Qt}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new pi(5,5,5),s=new Pe({name:"CubemapFromEquirect",uniforms:ps(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ie,blending:Ne});s.uniforms.tEquirect.value=e;let o=new Zt(i,s),a=e.minFilter;return e.minFilter===Zn&&(e.minFilter=Qt),new tl(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){let s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(s)}},Vh=new R,$_=new R,Z_=new Ht,fn=class{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let i=Vh.subVectors(n,e).cross($_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Vh),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let s=-(t.start.dot(this.normal)+this.constant)/i;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Z_.getNormalMatrix(t),i=this.coplanarPoint(Vh).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},Qi=new Ue,$a=new R,vr=class{constructor(t=new fn,e=new fn,n=new fn,i=new fn,s=new fn,o=new fn){this.planes=[t,e,n,i,s,o]}set(t,e,n,i,s,o){let a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Jn){let n=this.planes,i=t.elements,s=i[0],o=i[1],a=i[2],c=i[3],l=i[4],h=i[5],f=i[6],u=i[7],d=i[8],g=i[9],x=i[10],p=i[11],m=i[12],_=i[13],v=i[14],y=i[15];if(n[0].setComponents(c-s,u-l,p-d,y-m).normalize(),n[1].setComponents(c+s,u+l,p+d,y+m).normalize(),n[2].setComponents(c+o,u+h,p+g,y+_).normalize(),n[3].setComponents(c-o,u-h,p-g,y-_).normalize(),n[4].setComponents(c-a,u-f,p-x,y-v).normalize(),e===Jn)n[5].setComponents(c+a,u+f,p+x,y+v).normalize();else if(e===No)n[5].setComponents(a,f,x,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Qi)}intersectsSprite(t){return Qi.center.set(0,0,0),Qi.radius=.7071067811865476,Qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Qi)}intersectsSphere(t){let e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let i=e[n];if($a.x=i.normal.x>0?t.max.x:t.min.x,$a.y=i.normal.y>0?t.max.y:t.min.y,$a.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint($a)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function T0(){let r=null,t=!1,e=null,n=null;function i(s,o){e(s,o),n=r.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function J_(r){let t=new WeakMap;function e(a,c){let l=a.array,h=a.usage,f=l.byteLength,u=r.createBuffer();r.bindBuffer(c,u),r.bufferData(c,l,h),a.onUploadCallback();let d;if(l instanceof Float32Array)d=r.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?d=r.HALF_FLOAT:d=r.UNSIGNED_SHORT;else if(l instanceof Int16Array)d=r.SHORT;else if(l instanceof Uint32Array)d=r.UNSIGNED_INT;else if(l instanceof Int32Array)d=r.INT;else if(l instanceof Int8Array)d=r.BYTE;else if(l instanceof Uint8Array)d=r.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)d=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:d,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:f}}function n(a,c,l){let h=c.array,f=c._updateRange,u=c.updateRanges;if(r.bindBuffer(l,a),f.count===-1&&u.length===0&&r.bufferSubData(l,0,h),u.length!==0){for(let d=0,g=u.length;d<g;d++){let x=u[d];r.bufferSubData(l,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}c.clearUpdateRanges()}f.count!==-1&&(r.bufferSubData(l,f.offset*h.BYTES_PER_ELEMENT,h,f.offset,f.count),f.count=-1),c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let c=t.get(a);c&&(r.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isGLBufferAttribute){let h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);let l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:s,update:o}}var ms=class r extends Rt{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};let s=t/2,o=e/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,f=t/a,u=e/c,d=[],g=[],x=[],p=[];for(let m=0;m<h;m++){let _=m*u-o;for(let v=0;v<l;v++){let y=v*f-s;g.push(y,-_,0),x.push(0,0,1),p.push(v/a),p.push(1-m/c)}}for(let m=0;m<c;m++)for(let _=0;_<a;_++){let v=_+l*m,y=_+l*(m+1),w=_+1+l*(m+1),S=_+1+l*m;d.push(v,y,S),d.push(y,w,S)}this.setIndex(d),this.setAttribute("position",new yt(g,3)),this.setAttribute("normal",new yt(x,3)),this.setAttribute("uv",new yt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.width,t.height,t.widthSegments,t.heightSegments)}},K_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Q_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,j_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ty=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ey=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ny=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,iy=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ry=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sy=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,oy=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,ay=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,cy=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ly=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,uy=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,hy=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,fy=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,dy=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,py=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,my=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gy=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,xy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vy=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,_y=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,yy=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,by=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,My=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Sy=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ty=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,wy=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ay=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ey="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ry=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Cy=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Iy=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Py=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Dy=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ly=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Fy=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ny=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Uy=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,By=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Oy=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zy=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,ky=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Vy=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Hy=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Gy=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Wy=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Xy=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qy=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Yy=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,$y=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Zy=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Jy=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Ky=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Qy=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jy=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,tb=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,eb=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nb=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,ib=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,rb=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,sb=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,ob=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,ab=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,cb=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,lb=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ub=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,hb=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,fb=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,db=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pb=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,mb=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,gb=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,xb=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vb=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,_b=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,yb=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bb=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Mb=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Sb=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tb=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,wb=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Ab=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Eb=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Rb=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Cb=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ib=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Pb=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Db=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,Lb=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Fb=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Nb=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Ub=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Bb=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ob=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zb=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,kb=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Vb=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Hb=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Gb=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Wb=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Xb=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,qb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Yb=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$b=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Zb=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Jb=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Kb=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Qb=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jb=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,iM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,rM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,sM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,oM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,aM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,lM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,uM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,hM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,fM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,mM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,xM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,vM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,_M=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,bM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,MM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,SM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,TM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,wM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,AM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,EM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,RM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,CM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Yt={alphahash_fragment:K_,alphahash_pars_fragment:Q_,alphamap_fragment:j_,alphamap_pars_fragment:ty,alphatest_fragment:ey,alphatest_pars_fragment:ny,aomap_fragment:iy,aomap_pars_fragment:ry,batching_pars_vertex:sy,batching_vertex:oy,begin_vertex:ay,beginnormal_vertex:cy,bsdfs:ly,iridescence_fragment:uy,bumpmap_pars_fragment:hy,clipping_planes_fragment:fy,clipping_planes_pars_fragment:dy,clipping_planes_pars_vertex:py,clipping_planes_vertex:my,color_fragment:gy,color_pars_fragment:xy,color_pars_vertex:vy,color_vertex:_y,common:yy,cube_uv_reflection_fragment:by,defaultnormal_vertex:My,displacementmap_pars_vertex:Sy,displacementmap_vertex:Ty,emissivemap_fragment:wy,emissivemap_pars_fragment:Ay,colorspace_fragment:Ey,colorspace_pars_fragment:Ry,envmap_fragment:Cy,envmap_common_pars_fragment:Iy,envmap_pars_fragment:Py,envmap_pars_vertex:Dy,envmap_physical_pars_fragment:Gy,envmap_vertex:Ly,fog_vertex:Fy,fog_pars_vertex:Ny,fog_fragment:Uy,fog_pars_fragment:By,gradientmap_pars_fragment:Oy,lightmap_pars_fragment:zy,lights_lambert_fragment:ky,lights_lambert_pars_fragment:Vy,lights_pars_begin:Hy,lights_toon_fragment:Wy,lights_toon_pars_fragment:Xy,lights_phong_fragment:qy,lights_phong_pars_fragment:Yy,lights_physical_fragment:$y,lights_physical_pars_fragment:Zy,lights_fragment_begin:Jy,lights_fragment_maps:Ky,lights_fragment_end:Qy,logdepthbuf_fragment:jy,logdepthbuf_pars_fragment:tb,logdepthbuf_pars_vertex:eb,logdepthbuf_vertex:nb,map_fragment:ib,map_pars_fragment:rb,map_particle_fragment:sb,map_particle_pars_fragment:ob,metalnessmap_fragment:ab,metalnessmap_pars_fragment:cb,morphinstance_vertex:lb,morphcolor_vertex:ub,morphnormal_vertex:hb,morphtarget_pars_vertex:fb,morphtarget_vertex:db,normal_fragment_begin:pb,normal_fragment_maps:mb,normal_pars_fragment:gb,normal_pars_vertex:xb,normal_vertex:vb,normalmap_pars_fragment:_b,clearcoat_normal_fragment_begin:yb,clearcoat_normal_fragment_maps:bb,clearcoat_pars_fragment:Mb,iridescence_pars_fragment:Sb,opaque_fragment:Tb,packing:wb,premultiplied_alpha_fragment:Ab,project_vertex:Eb,dithering_fragment:Rb,dithering_pars_fragment:Cb,roughnessmap_fragment:Ib,roughnessmap_pars_fragment:Pb,shadowmap_pars_fragment:Db,shadowmap_pars_vertex:Lb,shadowmap_vertex:Fb,shadowmask_pars_fragment:Nb,skinbase_vertex:Ub,skinning_pars_vertex:Bb,skinning_vertex:Ob,skinnormal_vertex:zb,specularmap_fragment:kb,specularmap_pars_fragment:Vb,tonemapping_fragment:Hb,tonemapping_pars_fragment:Gb,transmission_fragment:Wb,transmission_pars_fragment:Xb,uv_pars_fragment:qb,uv_pars_vertex:Yb,uv_vertex:$b,worldpos_vertex:Zb,background_vert:Jb,background_frag:Kb,backgroundCube_vert:Qb,backgroundCube_frag:jb,cube_vert:tM,cube_frag:eM,depth_vert:nM,depth_frag:iM,distanceRGBA_vert:rM,distanceRGBA_frag:sM,equirect_vert:oM,equirect_frag:aM,linedashed_vert:cM,linedashed_frag:lM,meshbasic_vert:uM,meshbasic_frag:hM,meshlambert_vert:fM,meshlambert_frag:dM,meshmatcap_vert:pM,meshmatcap_frag:mM,meshnormal_vert:gM,meshnormal_frag:xM,meshphong_vert:vM,meshphong_frag:_M,meshphysical_vert:yM,meshphysical_frag:bM,meshtoon_vert:MM,meshtoon_frag:SM,points_vert:TM,points_frag:wM,shadow_vert:AM,shadow_frag:EM,sprite_vert:RM,sprite_frag:CM},ut={common:{diffuse:{value:new at(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ht}},envmap:{envMap:{value:null},envMapRotation:{value:new Ht},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ht},normalScale:{value:new X(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new at(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new at(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0},uvTransform:{value:new Ht}},sprite:{diffuse:{value:new at(16777215)},opacity:{value:1},center:{value:new X(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}}},Un={basic:{uniforms:on([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.fog]),vertexShader:Yt.meshbasic_vert,fragmentShader:Yt.meshbasic_frag},lambert:{uniforms:on([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new at(0)}}]),vertexShader:Yt.meshlambert_vert,fragmentShader:Yt.meshlambert_frag},phong:{uniforms:on([ut.common,ut.specularmap,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,ut.lights,{emissive:{value:new at(0)},specular:{value:new at(1118481)},shininess:{value:30}}]),vertexShader:Yt.meshphong_vert,fragmentShader:Yt.meshphong_frag},standard:{uniforms:on([ut.common,ut.envmap,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.roughnessmap,ut.metalnessmap,ut.fog,ut.lights,{emissive:{value:new at(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag},toon:{uniforms:on([ut.common,ut.aomap,ut.lightmap,ut.emissivemap,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.gradientmap,ut.fog,ut.lights,{emissive:{value:new at(0)}}]),vertexShader:Yt.meshtoon_vert,fragmentShader:Yt.meshtoon_frag},matcap:{uniforms:on([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,ut.fog,{matcap:{value:null}}]),vertexShader:Yt.meshmatcap_vert,fragmentShader:Yt.meshmatcap_frag},points:{uniforms:on([ut.points,ut.fog]),vertexShader:Yt.points_vert,fragmentShader:Yt.points_frag},dashed:{uniforms:on([ut.common,ut.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Yt.linedashed_vert,fragmentShader:Yt.linedashed_frag},depth:{uniforms:on([ut.common,ut.displacementmap]),vertexShader:Yt.depth_vert,fragmentShader:Yt.depth_frag},normal:{uniforms:on([ut.common,ut.bumpmap,ut.normalmap,ut.displacementmap,{opacity:{value:1}}]),vertexShader:Yt.meshnormal_vert,fragmentShader:Yt.meshnormal_frag},sprite:{uniforms:on([ut.sprite,ut.fog]),vertexShader:Yt.sprite_vert,fragmentShader:Yt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Yt.background_vert,fragmentShader:Yt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ht}},vertexShader:Yt.backgroundCube_vert,fragmentShader:Yt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Yt.cube_vert,fragmentShader:Yt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Yt.equirect_vert,fragmentShader:Yt.equirect_frag},distanceRGBA:{uniforms:on([ut.common,ut.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Yt.distanceRGBA_vert,fragmentShader:Yt.distanceRGBA_frag},shadow:{uniforms:on([ut.lights,ut.fog,{color:{value:new at(0)},opacity:{value:1}}]),vertexShader:Yt.shadow_vert,fragmentShader:Yt.shadow_frag}};Un.physical={uniforms:on([Un.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ht},clearcoatNormalScale:{value:new X(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ht},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ht},sheen:{value:0},sheenColor:{value:new at(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ht},transmissionSamplerSize:{value:new X},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ht},attenuationDistance:{value:0},attenuationColor:{value:new at(0)},specularColor:{value:new at(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ht},anisotropyVector:{value:new X},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ht}}]),vertexShader:Yt.meshphysical_vert,fragmentShader:Yt.meshphysical_frag};var Za={r:0,b:0,g:0},ji=new Sn,IM=new dt;function PM(r,t,e,n,i,s,o){let a=new at(0),c=s===!0?0:1,l,h,f=null,u=0,d=null;function g(_){let v=_.isScene===!0?_.background:null;return v&&v.isTexture&&(v=(_.backgroundBlurriness>0?e:t).get(v)),v}function x(_){let v=!1,y=g(_);y===null?m(a,c):y&&y.isColor&&(m(y,1),v=!0);let w=r.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,o):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(r.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function p(_,v){let y=g(v);y&&(y.isCubeTexture||y.mapping===ws)?(h===void 0&&(h=new Zt(new pi(1,1,1),new Pe({name:"BackgroundCubeMaterial",uniforms:ps(Un.backgroundCube.uniforms),vertexShader:Un.backgroundCube.vertexShader,fragmentShader:Un.backgroundCube.fragmentShader,side:Ie,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(w,S,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),ji.copy(v.backgroundRotation),ji.x*=-1,ji.y*=-1,ji.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(ji.y*=-1,ji.z*=-1),h.material.uniforms.envMap.value=y,h.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(IM.makeRotationFromEuler(ji)),h.material.toneMapped=se.getTransfer(y.colorSpace)!==pe,(f!==y||u!==y.version||d!==r.toneMapping)&&(h.material.needsUpdate=!0,f=y,u=y.version,d=r.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Zt(new ms(2,2),new Pe({name:"BackgroundMaterial",uniforms:ps(Un.background.uniforms),vertexShader:Un.background.vertexShader,fragmentShader:Un.background.fragmentShader,side:pn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=se.getTransfer(y.colorSpace)!==pe,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||u!==y.version||d!==r.toneMapping)&&(l.material.needsUpdate=!0,f=y,u=y.version,d=r.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function m(_,v){_.getRGB(Za,M0(r)),n.buffers.color.setClear(Za.r,Za.g,Za.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(_,v=1){a.set(_),c=v,m(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,m(a,c)},render:x,addToRenderList:p}}function DM(r,t){let e=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=u(null),s=i,o=!1;function a(b,I,D,F,N){let k=!1,U=f(F,D,I);s!==U&&(s=U,l(s.object)),k=d(b,F,D,N),k&&g(b,F,D,N),N!==null&&t.update(N,r.ELEMENT_ARRAY_BUFFER),(k||o)&&(o=!1,y(b,I,D,F),N!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(N).buffer))}function c(){return r.createVertexArray()}function l(b){return r.bindVertexArray(b)}function h(b){return r.deleteVertexArray(b)}function f(b,I,D){let F=D.wireframe===!0,N=n[b.id];N===void 0&&(N={},n[b.id]=N);let k=N[I.id];k===void 0&&(k={},N[I.id]=k);let U=k[F];return U===void 0&&(U=u(c()),k[F]=U),U}function u(b){let I=[],D=[],F=[];for(let N=0;N<e;N++)I[N]=0,D[N]=0,F[N]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:D,attributeDivisors:F,object:b,attributes:{},index:null}}function d(b,I,D,F){let N=s.attributes,k=I.attributes,U=0,$=D.getAttributes();for(let W in $)if($[W].location>=0){let lt=N[W],gt=k[W];if(gt===void 0&&(W==="instanceMatrix"&&b.instanceMatrix&&(gt=b.instanceMatrix),W==="instanceColor"&&b.instanceColor&&(gt=b.instanceColor)),lt===void 0||lt.attribute!==gt||gt&&lt.data!==gt.data)return!0;U++}return s.attributesNum!==U||s.index!==F}function g(b,I,D,F){let N={},k=I.attributes,U=0,$=D.getAttributes();for(let W in $)if($[W].location>=0){let lt=k[W];lt===void 0&&(W==="instanceMatrix"&&b.instanceMatrix&&(lt=b.instanceMatrix),W==="instanceColor"&&b.instanceColor&&(lt=b.instanceColor));let gt={};gt.attribute=lt,lt&&lt.data&&(gt.data=lt.data),N[W]=gt,U++}s.attributes=N,s.attributesNum=U,s.index=F}function x(){let b=s.newAttributes;for(let I=0,D=b.length;I<D;I++)b[I]=0}function p(b){m(b,0)}function m(b,I){let D=s.newAttributes,F=s.enabledAttributes,N=s.attributeDivisors;D[b]=1,F[b]===0&&(r.enableVertexAttribArray(b),F[b]=1),N[b]!==I&&(r.vertexAttribDivisor(b,I),N[b]=I)}function _(){let b=s.newAttributes,I=s.enabledAttributes;for(let D=0,F=I.length;D<F;D++)I[D]!==b[D]&&(r.disableVertexAttribArray(D),I[D]=0)}function v(b,I,D,F,N,k,U){U===!0?r.vertexAttribIPointer(b,I,D,N,k):r.vertexAttribPointer(b,I,D,F,N,k)}function y(b,I,D,F){x();let N=F.attributes,k=D.getAttributes(),U=I.defaultAttributeValues;for(let $ in k){let W=k[$];if(W.location>=0){let st=N[$];if(st===void 0&&($==="instanceMatrix"&&b.instanceMatrix&&(st=b.instanceMatrix),$==="instanceColor"&&b.instanceColor&&(st=b.instanceColor)),st!==void 0){let lt=st.normalized,gt=st.itemSize,Pt=t.get(st);if(Pt===void 0)continue;let qt=Pt.buffer,q=Pt.type,et=Pt.bytesPerElement,bt=q===r.INT||q===r.UNSIGNED_INT||st.gpuType===Oi;if(st.isInterleavedBufferAttribute){let ft=st.data,Ot=ft.stride,$t=st.offset;if(ft.isInstancedInterleavedBuffer){for(let zt=0;zt<W.locationSize;zt++)m(W.location+zt,ft.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ft.meshPerAttribute*ft.count)}else for(let zt=0;zt<W.locationSize;zt++)p(W.location+zt);r.bindBuffer(r.ARRAY_BUFFER,qt);for(let zt=0;zt<W.locationSize;zt++)v(W.location+zt,gt/W.locationSize,q,lt,Ot*et,($t+gt/W.locationSize*zt)*et,bt)}else{if(st.isInstancedBufferAttribute){for(let ft=0;ft<W.locationSize;ft++)m(W.location+ft,st.meshPerAttribute);b.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let ft=0;ft<W.locationSize;ft++)p(W.location+ft);r.bindBuffer(r.ARRAY_BUFFER,qt);for(let ft=0;ft<W.locationSize;ft++)v(W.location+ft,gt/W.locationSize,q,lt,gt*et,gt/W.locationSize*ft*et,bt)}}else if(U!==void 0){let lt=U[$];if(lt!==void 0)switch(lt.length){case 2:r.vertexAttrib2fv(W.location,lt);break;case 3:r.vertexAttrib3fv(W.location,lt);break;case 4:r.vertexAttrib4fv(W.location,lt);break;default:r.vertexAttrib1fv(W.location,lt)}}}}_()}function w(){A();for(let b in n){let I=n[b];for(let D in I){let F=I[D];for(let N in F)h(F[N].object),delete F[N];delete I[D]}delete n[b]}}function S(b){if(n[b.id]===void 0)return;let I=n[b.id];for(let D in I){let F=I[D];for(let N in F)h(F[N].object),delete F[N];delete I[D]}delete n[b.id]}function T(b){for(let I in n){let D=n[I];if(D[b.id]===void 0)continue;let F=D[b.id];for(let N in F)h(F[N].object),delete F[N];delete D[b.id]}}function A(){M(),o=!0,s!==i&&(s=i,l(s.object))}function M(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:A,resetDefaultState:M,dispose:w,releaseStatesOfGeometry:S,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:p,disableUnusedAttributes:_}}function LM(r,t,e){let n;function i(l){n=l}function s(l,h){r.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,f){f!==0&&(r.drawArraysInstanced(n,l,h,f),e.update(h,n,f))}function a(l,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,h,0,f);let d=0;for(let g=0;g<f;g++)d+=h[g];e.update(d,n,1)}function c(l,h,f,u){if(f===0)return;let d=t.get("WEBGL_multi_draw");if(d===null)for(let g=0;g<l.length;g++)o(l[g],h[g],u[g]);else{d.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,f);let g=0;for(let x=0;x<f;x++)g+=h[x];for(let x=0;x<u.length;x++)e.update(g,n,u[x])}}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function FM(r,t,e,n){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){let S=t.get("EXT_texture_filter_anisotropic");i=r.getParameter(S.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(S){return!(S!==Lt&&n.convert(S)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(S){let T=S===me&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(S!==cn&&n.convert(S)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&S!==Dt&&!T)}function c(S){if(S==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";S="mediump"}return S==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp",h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);let f=e.logarithmicDepthBuffer===!0,u=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),d=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_TEXTURE_SIZE),x=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),p=r.getParameter(r.MAX_VERTEX_ATTRIBS),m=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),_=r.getParameter(r.MAX_VARYING_VECTORS),v=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),y=d>0,w=r.getParameter(r.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:f,maxTextures:u,maxVertexTextures:d,maxTextureSize:g,maxCubemapSize:x,maxAttributes:p,maxVertexUniforms:m,maxVaryings:_,maxFragmentUniforms:v,vertexTextures:y,maxSamples:w}}function NM(r){let t=this,e=null,n=0,i=!1,s=!1,o=new fn,a=new Ht,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){let d=f.length!==0||u||n!==0||i;return i=u,n=f.length,d},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,u){e=h(f,u,0)},this.setState=function(f,u,d){let g=f.clippingPlanes,x=f.clipIntersection,p=f.clipShadows,m=r.get(f);if(!i||g===null||g.length===0||s&&!p)s?h(null):l();else{let _=s?0:n,v=_*4,y=m.clippingState||null;c.value=y,y=h(g,u,v,d);for(let w=0;w!==v;++w)y[w]=e[w];m.clippingState=y,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(f,u,d,g){let x=f!==null?f.length:0,p=null;if(x!==0){if(p=c.value,g!==!0||p===null){let m=d+x*4,_=u.matrixWorldInverse;a.getNormalMatrix(_),(p===null||p.length<m)&&(p=new Float32Array(m));for(let v=0,y=d;v!==x;++v,y+=4)o.copy(f[v]).applyMatrix4(_,a),o.normal.toArray(p,y),p[y+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}function UM(r){let t=new WeakMap;function e(o,a){return a===kn?o.mapping=di:a===Eo&&(o.mapping=Ci),o}function n(o){if(o&&o.isTexture){let a=o.mapping;if(a===kn||a===Eo)if(t.has(o)){let c=t.get(o).texture;return e(c,o.mapping)}else{let c=o.image;if(c&&c.height>0){let l=new el(c.height);return l.fromEquirectangularTexture(r,o),t.set(o,l),o.addEventListener("dispose",i),e(l.texture,o.mapping)}else return null}}return o}function i(o){let a=o.target;a.removeEventListener("dispose",i);let c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}var Fi=class extends Li{constructor(t=-1,e=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-t,o=n+t,a=i+e,c=i-e;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},cs=4,lm=[.125,.215,.35,.446,.526,.582],lr=20,Hh=new Fi,um=new at,Gh=null,Wh=0,Xh=0,qh=!1,cr=(1+Math.sqrt(5))/2,ts=1/cr,hm=[new R(-cr,ts,0),new R(cr,ts,0),new R(-ts,0,cr),new R(ts,0,cr),new R(0,cr,-ts),new R(0,cr,ts),new R(-1,1,-1),new R(1,1,-1),new R(-1,1,1),new R(1,1,1)],_r=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){Gh=this._renderer.getRenderTarget(),Wh=this._renderer.getActiveCubeFace(),Xh=this._renderer.getActiveMipmapLevel(),qh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);let s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,i,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Gh,Wh,Xh),this._renderer.xr.enabled=qh,t.scissorTest=!1,Ja(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===di||t.mapping===Ci?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Gh=this._renderer.getRenderTarget(),Wh=this._renderer.getActiveCubeFace(),Xh=this._renderer.getActiveMipmapLevel(),qh=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Qt,minFilter:Qt,generateMipmaps:!1,type:me,format:Lt,colorSpace:Wn,depthBuffer:!1},i=fm(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fm(t,e,n);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=BM(s)),this._blurMaterial=OM(s,t,e)}return i}_compileMaterial(t){let e=new Zt(this._lodPlanes[0],t);this._renderer.compile(e,Hh)}_sceneToCubeUV(t,e,n,i){let a=new _e(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,f=h.autoClear,u=h.toneMapping;h.getClearColor(um),h.toneMapping=zn,h.autoClear=!1;let d=new mn({name:"PMREM.Background",side:Ie,depthWrite:!1,depthTest:!1}),g=new Zt(new pi,d),x=!1,p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,x=!0):(d.color.copy(um),x=!0);for(let m=0;m<6;m++){let _=m%3;_===0?(a.up.set(0,c[m],0),a.lookAt(l[m],0,0)):_===1?(a.up.set(0,0,c[m]),a.lookAt(0,l[m],0)):(a.up.set(0,c[m],0),a.lookAt(0,0,l[m]));let v=this._cubeSize;Ja(i,_*v,m>2?v:0,v,v),h.setRenderTarget(i),x&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=f,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,i=t.mapping===di||t.mapping===Ci;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=pm()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dm());let s=i?this._cubemapMaterial:this._equirectMaterial,o=new Zt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;let c=this._cubeSize;Ja(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,Hh)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;let i=this._lodPlanes.length;for(let s=1;s<i;s++){let o=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=hm[(i-s-1)%hm.length];this._blur(t,s-1,s,o,a)}e.autoClear=n}_blur(t,e,n,i,s){let o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",s),this._halfBlur(o,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,o,a){let c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let h=3,f=new Zt(this._lodPlanes[i],l),u=l.uniforms,d=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*d):2*Math.PI/(2*lr-1),x=s/g,p=isFinite(s)?1+Math.floor(h*x):lr;p>lr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${lr}`);let m=[],_=0;for(let T=0;T<lr;++T){let A=T/x,M=Math.exp(-A*A/2);m.push(M),T===0?_+=M:T<p&&(_+=2*M)}for(let T=0;T<m.length;T++)m[T]=m[T]/_;u.envMap.value=t.texture,u.samples.value=p,u.weights.value=m,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);let{_lodMax:v}=this;u.dTheta.value=g,u.mipInt.value=v-n;let y=this._sizeLods[i],w=3*y*(i>v-cs?i-v+cs:0),S=4*(this._cubeSize-y);Ja(e,w,S,3*y,2*y),c.setRenderTarget(e),c.render(f,Hh)}};function BM(r){let t=[],e=[],n=[],i=r,s=r-cs+1+lm.length;for(let o=0;o<s;o++){let a=Math.pow(2,i);e.push(a);let c=1/a;o>r-cs?c=lm[o-r+cs-1]:o===0&&(c=0),n.push(c);let l=1/(a-2),h=-l,f=1+l,u=[h,h,f,h,f,f,h,h,f,f,h,f],d=6,g=6,x=3,p=2,m=1,_=new Float32Array(x*g*d),v=new Float32Array(p*g*d),y=new Float32Array(m*g*d);for(let S=0;S<d;S++){let T=S%3*2/3-1,A=S>2?0:-1,M=[T,A,0,T+2/3,A,0,T+2/3,A+1,0,T,A,0,T+2/3,A+1,0,T,A+1,0];_.set(M,x*g*S),v.set(u,p*g*S);let b=[S,S,S,S,S,S];y.set(b,m*g*S)}let w=new Rt;w.setAttribute("position",new Ft(_,x)),w.setAttribute("uv",new Ft(v,p)),w.setAttribute("faceIndex",new Ft(y,m)),t.push(w),i>cs&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function fm(r,t,e){let n=new be(r,t,e);return n.texture.mapping=ws,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ja(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function OM(r,t,e){let n=new Float32Array(lr),i=new R(0,1,0);return new Pe({name:"SphericalGaussianBlur",defines:{n:lr,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Gd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ne,depthTest:!1,depthWrite:!1})}function dm(){return new Pe({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Gd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ne,depthTest:!1,depthWrite:!1})}function pm(){return new Pe({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Gd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ne,depthTest:!1,depthWrite:!1})}function Gd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function zM(r){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){let c=a.mapping,l=c===kn||c===Eo,h=c===di||c===Ci;if(l||h){let f=t.get(a),u=f!==void 0?f.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return e===null&&(e=new _r(r)),f=l?e.fromEquirectangular(a,f):e.fromCubemap(a,f),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),f.texture;if(f!==void 0)return f.texture;{let d=a.image;return l&&d&&d.height>0||h&&d&&i(d)?(e===null&&(e=new _r(r)),f=l?e.fromEquirectangular(a):e.fromCubemap(a),f.texture.pmremVersion=a.pmremVersion,t.set(a,f),a.addEventListener("dispose",s),f.texture):null}}}return a}function i(a){let c=0,l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function s(a){let c=a.target;c.removeEventListener("dispose",s);let l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function kM(r){let t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=r.getExtension("WEBGL_depth_texture")||r.getExtension("MOZ_WEBGL_depth_texture")||r.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=r.getExtension("EXT_texture_filter_anisotropic")||r.getExtension("MOZ_EXT_texture_filter_anisotropic")||r.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=r.getExtension("WEBGL_compressed_texture_s3tc")||r.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=r.getExtension("WEBGL_compressed_texture_pvrtc")||r.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=r.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let i=e(n);return i===null&&Hd("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function VM(r,t,e,n){let i={},s=new WeakMap;function o(f){let u=f.target;u.index!==null&&t.remove(u.index);for(let g in u.attributes)t.remove(u.attributes[g]);for(let g in u.morphAttributes){let x=u.morphAttributes[g];for(let p=0,m=x.length;p<m;p++)t.remove(x[p])}u.removeEventListener("dispose",o),delete i[u.id];let d=s.get(u);d&&(t.remove(d),s.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,e.memory.geometries--}function a(f,u){return i[u.id]===!0||(u.addEventListener("dispose",o),i[u.id]=!0,e.memory.geometries++),u}function c(f){let u=f.attributes;for(let g in u)t.update(u[g],r.ARRAY_BUFFER);let d=f.morphAttributes;for(let g in d){let x=d[g];for(let p=0,m=x.length;p<m;p++)t.update(x[p],r.ARRAY_BUFFER)}}function l(f){let u=[],d=f.index,g=f.attributes.position,x=0;if(d!==null){let _=d.array;x=d.version;for(let v=0,y=_.length;v<y;v+=3){let w=_[v+0],S=_[v+1],T=_[v+2];u.push(w,S,S,T,T,w)}}else if(g!==void 0){let _=g.array;x=g.version;for(let v=0,y=_.length/3-1;v<y;v+=3){let w=v+0,S=v+1,T=v+2;u.push(w,S,S,T,T,w)}}else return;let p=new(_0(u)?ko:zo)(u,1);p.version=x;let m=s.get(f);m&&t.remove(m),s.set(f,p)}function h(f){let u=s.get(f);if(u){let d=f.index;d!==null&&u.version<d.version&&l(f)}else l(f);return s.get(f)}return{get:a,update:c,getWireframeAttribute:h}}function HM(r,t,e){let n;function i(u){n=u}let s,o;function a(u){s=u.type,o=u.bytesPerElement}function c(u,d){r.drawElements(n,d,s,u*o),e.update(d,n,1)}function l(u,d,g){g!==0&&(r.drawElementsInstanced(n,d,s,u*o,g),e.update(d,n,g))}function h(u,d,g){if(g===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,s,u,0,g);let p=0;for(let m=0;m<g;m++)p+=d[m];e.update(p,n,1)}function f(u,d,g,x){if(g===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let m=0;m<u.length;m++)l(u[m]/o,d[m],x[m]);else{p.multiDrawElementsInstancedWEBGL(n,d,0,s,u,0,x,0,g);let m=0;for(let _=0;_<g;_++)m+=d[_];for(let _=0;_<x.length;_++)e.update(m,n,x[_])}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=f}function GM(r){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case r.TRIANGLES:e.triangles+=a*(s/3);break;case r.LINES:e.lines+=a*(s/2);break;case r.LINE_STRIP:e.lines+=a*(s-1);break;case r.LINE_LOOP:e.lines+=a*s;break;case r.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function WM(r,t,e){let n=new WeakMap,i=new Kt;function s(o,a,c){let l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=h!==void 0?h.length:0,u=n.get(a);if(u===void 0||u.count!==f){let M=function(){T.dispose(),n.delete(a),a.removeEventListener("dispose",M)};u!==void 0&&u.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],_=a.morphAttributes.color||[],v=0;d===!0&&(v=1),g===!0&&(v=2),x===!0&&(v=3);let y=a.attributes.position.count*v,w=1;y>t.maxTextureSize&&(w=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize);let S=new Float32Array(y*w*4*f),T=new Pi(S,y,w,f);T.type=Dt,T.needsUpdate=!0;let A=v*4;for(let b=0;b<f;b++){let I=p[b],D=m[b],F=_[b],N=y*w*4*b;for(let k=0;k<I.count;k++){let U=k*A;d===!0&&(i.fromBufferAttribute(I,k),S[N+U+0]=i.x,S[N+U+1]=i.y,S[N+U+2]=i.z,S[N+U+3]=0),g===!0&&(i.fromBufferAttribute(D,k),S[N+U+4]=i.x,S[N+U+5]=i.y,S[N+U+6]=i.z,S[N+U+7]=0),x===!0&&(i.fromBufferAttribute(F,k),S[N+U+8]=i.x,S[N+U+9]=i.y,S[N+U+10]=i.z,S[N+U+11]=F.itemSize===4?i.w:1)}}u={count:f,texture:T,size:new X(y,w)},n.set(a,u),a.addEventListener("dispose",M)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(r,"morphTexture",o.morphTexture,e);else{let d=0;for(let x=0;x<l.length;x++)d+=l[x];let g=a.morphTargetsRelative?1:1-d;c.getUniforms().setValue(r,"morphTargetBaseInfluence",g),c.getUniforms().setValue(r,"morphTargetInfluences",l)}c.getUniforms().setValue(r,"morphTargetsTexture",u.texture,e),c.getUniforms().setValue(r,"morphTargetsTextureSize",u.size)}return{update:s}}function XM(r,t,e,n){let i=new WeakMap;function s(c){let l=n.render.frame,h=c.geometry,f=t.get(c,h);if(i.get(f)!==l&&(t.update(f),i.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(e.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,r.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){let u=c.skeleton;i.get(u)!==l&&(u.update(),i.set(u,l))}return f}function o(){i=new WeakMap}function a(c){let l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}var Vo=class extends Be{constructor(t,e,n,i,s,o,a,c,l,h=dr){if(h!==dr&&h!==gr)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===dr&&(n=nn),n===void 0&&h===gr&&(n=mr),super(null,i,s,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Nt,this.minFilter=c!==void 0?c:Nt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},w0=new Be,mm=new Vo(1,1),A0=new Pi,E0=new Oo,R0=new xr,gm=[],xm=[],vm=new Float32Array(16),_m=new Float32Array(9),ym=new Float32Array(4);function Es(r,t,e){let n=r[0];if(n<=0||n>0)return r;let i=t*e,s=gm[i];if(s===void 0&&(s=new Float32Array(i),gm[i]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,r[o].toArray(s,a)}return s}function ke(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function Ve(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function lu(r,t){let e=xm[t];e===void 0&&(e=new Int32Array(t),xm[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function qM(r,t){let e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function YM(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;r.uniform2fv(this.addr,t),Ve(e,t)}}function $M(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ke(e,t))return;r.uniform3fv(this.addr,t),Ve(e,t)}}function ZM(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;r.uniform4fv(this.addr,t),Ve(e,t)}}function JM(r,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;ym.set(n),r.uniformMatrix2fv(this.addr,!1,ym),Ve(e,n)}}function KM(r,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;_m.set(n),r.uniformMatrix3fv(this.addr,!1,_m),Ve(e,n)}}function QM(r,t){let e=this.cache,n=t.elements;if(n===void 0){if(ke(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),Ve(e,t)}else{if(ke(e,n))return;vm.set(n),r.uniformMatrix4fv(this.addr,!1,vm),Ve(e,n)}}function jM(r,t){let e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function tS(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;r.uniform2iv(this.addr,t),Ve(e,t)}}function eS(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;r.uniform3iv(this.addr,t),Ve(e,t)}}function nS(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;r.uniform4iv(this.addr,t),Ve(e,t)}}function iS(r,t){let e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function rS(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ke(e,t))return;r.uniform2uiv(this.addr,t),Ve(e,t)}}function sS(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ke(e,t))return;r.uniform3uiv(this.addr,t),Ve(e,t)}}function oS(r,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ke(e,t))return;r.uniform4uiv(this.addr,t),Ve(e,t)}}function aS(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(mm.compareFunction=kd,s=mm):s=w0,e.setTexture2D(t||s,i)}function cS(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||E0,i)}function lS(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||R0,i)}function uS(r,t,e){let n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||A0,i)}function hS(r){switch(r){case 5126:return qM;case 35664:return YM;case 35665:return $M;case 35666:return ZM;case 35674:return JM;case 35675:return KM;case 35676:return QM;case 5124:case 35670:return jM;case 35667:case 35671:return tS;case 35668:case 35672:return eS;case 35669:case 35673:return nS;case 5125:return iS;case 36294:return rS;case 36295:return sS;case 36296:return oS;case 35678:case 36198:case 36298:case 36306:case 35682:return aS;case 35679:case 36299:case 36307:return cS;case 35680:case 36300:case 36308:case 36293:return lS;case 36289:case 36303:case 36311:case 36292:return uS}}function fS(r,t){r.uniform1fv(this.addr,t)}function dS(r,t){let e=Es(t,this.size,2);r.uniform2fv(this.addr,e)}function pS(r,t){let e=Es(t,this.size,3);r.uniform3fv(this.addr,e)}function mS(r,t){let e=Es(t,this.size,4);r.uniform4fv(this.addr,e)}function gS(r,t){let e=Es(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function xS(r,t){let e=Es(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function vS(r,t){let e=Es(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function _S(r,t){r.uniform1iv(this.addr,t)}function yS(r,t){r.uniform2iv(this.addr,t)}function bS(r,t){r.uniform3iv(this.addr,t)}function MS(r,t){r.uniform4iv(this.addr,t)}function SS(r,t){r.uniform1uiv(this.addr,t)}function TS(r,t){r.uniform2uiv(this.addr,t)}function wS(r,t){r.uniform3uiv(this.addr,t)}function AS(r,t){r.uniform4uiv(this.addr,t)}function ES(r,t,e){let n=this.cache,i=t.length,s=lu(e,i);ke(n,s)||(r.uniform1iv(this.addr,s),Ve(n,s));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||w0,s[o])}function RS(r,t,e){let n=this.cache,i=t.length,s=lu(e,i);ke(n,s)||(r.uniform1iv(this.addr,s),Ve(n,s));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||E0,s[o])}function CS(r,t,e){let n=this.cache,i=t.length,s=lu(e,i);ke(n,s)||(r.uniform1iv(this.addr,s),Ve(n,s));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||R0,s[o])}function IS(r,t,e){let n=this.cache,i=t.length,s=lu(e,i);ke(n,s)||(r.uniform1iv(this.addr,s),Ve(n,s));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||A0,s[o])}function PS(r){switch(r){case 5126:return fS;case 35664:return dS;case 35665:return pS;case 35666:return mS;case 35674:return gS;case 35675:return xS;case 35676:return vS;case 5124:case 35670:return _S;case 35667:case 35671:return yS;case 35668:case 35672:return bS;case 35669:case 35673:return MS;case 5125:return SS;case 36294:return TS;case 36295:return wS;case 36296:return AS;case 35678:case 36198:case 36298:case 36306:case 35682:return ES;case 35679:case 36299:case 36307:return RS;case 35680:case 36300:case 36308:case 36293:return CS;case 36289:case 36303:case 36311:case 36292:return IS}}var Sf=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=hS(e.type)}},Tf=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=PS(e.type)}},wf=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let i=this.seq;for(let s=0,o=i.length;s!==o;++s){let a=i[s];a.setValue(t,e[a.id],n)}}},Yh=/(\w+)(\])?(\[|\.)?/g;function bm(r,t){r.seq.push(t),r.map[t.id]=t}function DS(r,t,e){let n=r.name,i=n.length;for(Yh.lastIndex=0;;){let s=Yh.exec(n),o=Yh.lastIndex,a=s[1],c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){bm(e,l===void 0?new Sf(a,r,t):new Tf(a,r,t));break}else{let f=e.map[a];f===void 0&&(f=new wf(a),bm(e,f)),e=f}}}var hs=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let s=t.getActiveUniform(e,i),o=t.getUniformLocation(e,s.name);DS(s,o,this)}}setValue(t,e,n,i){let s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){let i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,o=e.length;s!==o;++s){let a=e[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,i)}}static seqWithValue(t,e){let n=[];for(let i=0,s=t.length;i!==s;++i){let o=t[i];o.id in e&&n.push(o)}return n}};function Mm(r,t,e){let n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}var LS=37297,FS=0;function NS(r,t){let e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=i;o<s;o++){let a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function US(r){let t=se.getPrimaries(se.workingColorSpace),e=se.getPrimaries(r),n;switch(t===e?n="":t===Lo&&e===Do?n="LinearDisplayP3ToLinearSRGB":t===Do&&e===Lo&&(n="LinearSRGBToLinearDisplayP3"),r){case Wn:case pa:return[n,"LinearTransferOETF"];case Rn:case cu:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",r),[n,"LinearTransferOETF"]}}function Sm(r,t,e){let n=r.getShaderParameter(t,r.COMPILE_STATUS),i=r.getShaderInfoLog(t).trim();if(n&&i==="")return"";let s=/ERROR: 0:(\d+)/.exec(i);if(s){let o=parseInt(s[1]);return e.toUpperCase()+`

`+i+`

`+NS(r.getShaderSource(t),o)}else return i}function BS(r,t){let e=US(t);return`vec4 ${r}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function OS(r,t){let e;switch(t){case Qg:e="Linear";break;case jg:e="Reinhard";break;case t0:e="OptimizedCineon";break;case e0:e="ACESFilmic";break;case i0:e="AgX";break;case r0:e="Neutral";break;case n0:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function zS(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(po).join(`
`)}function kS(r){let t=[];for(let e in r){let n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function VS(r,t){let e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let s=r.getActiveAttrib(t,i),o=s.name,a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:r.getAttribLocation(t,o),locationSize:a}}return e}function po(r){return r!==""}function Tm(r,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function wm(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var HS=/^[ \t]*#include +<([\w\d./]+)>/gm;function Af(r){return r.replace(HS,WS)}var GS=new Map;function WS(r,t){let e=Yt[t];if(e===void 0){let n=GS.get(t);if(n!==void 0)e=Yt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Af(e)}var XS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Am(r){return r.replace(XS,qS)}function qS(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function Em(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function YS(r){let t="SHADOWMAP_TYPE_BASIC";return r.shadowMapType===Id?t="SHADOWMAP_TYPE_PCF":r.shadowMapType===Tg?t="SHADOWMAP_TYPE_PCF_SOFT":r.shadowMapType===$n&&(t="SHADOWMAP_TYPE_VSM"),t}function $S(r){let t="ENVMAP_TYPE_CUBE";if(r.envMap)switch(r.envMapMode){case di:case Ci:t="ENVMAP_TYPE_CUBE";break;case ws:t="ENVMAP_TYPE_CUBE_UV";break}return t}function ZS(r){let t="ENVMAP_MODE_REFLECTION";if(r.envMap)switch(r.envMapMode){case Ci:t="ENVMAP_MODE_REFRACTION";break}return t}function JS(r){let t="ENVMAP_BLENDING_NONE";if(r.envMap)switch(r.combine){case fa:t="ENVMAP_BLENDING_MULTIPLY";break;case Jg:t="ENVMAP_BLENDING_MIX";break;case Kg:t="ENVMAP_BLENDING_ADD";break}return t}function KS(r){let t=r.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function QS(r,t,e,n){let i=r.getContext(),s=e.defines,o=e.vertexShader,a=e.fragmentShader,c=YS(e),l=$S(e),h=ZS(e),f=JS(e),u=KS(e),d=zS(e),g=kS(s),x=i.createProgram(),p,m,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(po).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(po).join(`
`),m.length>0&&(m+=`
`)):(p=[Em(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(po).join(`
`),m=[Em(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==zn?"#define TONE_MAPPING":"",e.toneMapping!==zn?Yt.tonemapping_pars_fragment:"",e.toneMapping!==zn?OS("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Yt.colorspace_pars_fragment,BS("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(po).join(`
`)),o=Af(o),o=Tm(o,e),o=wm(o,e),a=Af(a),a=Tm(a,e),a=wm(a,e),o=Am(o),a=Am(a),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,p=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===mf?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===mf?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let v=_+p+o,y=_+m+a,w=Mm(i,i.VERTEX_SHADER,v),S=Mm(i,i.FRAGMENT_SHADER,y);i.attachShader(x,w),i.attachShader(x,S),e.index0AttributeName!==void 0?i.bindAttribLocation(x,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(x,0,"position"),i.linkProgram(x);function T(I){if(r.debug.checkShaderErrors){let D=i.getProgramInfoLog(x).trim(),F=i.getShaderInfoLog(w).trim(),N=i.getShaderInfoLog(S).trim(),k=!0,U=!0;if(i.getProgramParameter(x,i.LINK_STATUS)===!1)if(k=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,x,w,S);else{let $=Sm(i,w,"vertex"),W=Sm(i,S,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(x,i.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+D+`
`+$+`
`+W)}else D!==""?console.warn("THREE.WebGLProgram: Program Info Log:",D):(F===""||N==="")&&(U=!1);U&&(I.diagnostics={runnable:k,programLog:D,vertexShader:{log:F,prefix:p},fragmentShader:{log:N,prefix:m}})}i.deleteShader(w),i.deleteShader(S),A=new hs(i,x),M=VS(i,x)}let A;this.getUniforms=function(){return A===void 0&&T(this),A};let M;this.getAttributes=function(){return M===void 0&&T(this),M};let b=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return b===!1&&(b=i.getProgramParameter(x,LS)),b},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(x),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=FS++,this.cacheKey=t,this.usedTimes=1,this.program=x,this.vertexShader=w,this.fragmentShader=S,this}var jS=0,Ef=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Rf(t),e.set(t,n)),n}},Rf=class{constructor(t){this.id=jS++,this.code=t,this.usedTimes=0}};function tT(r,t,e,n,i,s,o){let a=new ds,c=new Ef,l=new Set,h=[],f=i.logarithmicDepthBuffer,u=i.vertexTextures,d=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(M){return l.add(M),M===0?"uv":`uv${M}`}function p(M,b,I,D,F){let N=D.fog,k=F.geometry,U=M.isMeshStandardMaterial?D.environment:null,$=(M.isMeshStandardMaterial?e:t).get(M.envMap||U),W=$&&$.mapping===ws?$.image.height:null,st=g[M.type];M.precision!==null&&(d=i.getMaxPrecision(M.precision),d!==M.precision&&console.warn("THREE.WebGLProgram.getParameters:",M.precision,"not supported, using",d,"instead."));let lt=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,gt=lt!==void 0?lt.length:0,Pt=0;k.morphAttributes.position!==void 0&&(Pt=1),k.morphAttributes.normal!==void 0&&(Pt=2),k.morphAttributes.color!==void 0&&(Pt=3);let qt,q,et,bt;if(st){let ae=Un[st];qt=ae.vertexShader,q=ae.fragmentShader}else qt=M.vertexShader,q=M.fragmentShader,c.update(M),et=c.getVertexShaderID(M),bt=c.getFragmentShaderID(M);let ft=r.getRenderTarget(),Ot=F.isInstancedMesh===!0,$t=F.isBatchedMesh===!0,zt=!!M.map,ie=!!M.matcap,P=!!$,it=!!M.aoMap,tt=!!M.lightMap,pt=!!M.bumpMap,Y=!!M.normalMap,Ct=!!M.displacementMap,mt=!!M.emissiveMap,Mt=!!M.metalnessMap,L=!!M.roughnessMap,E=M.anisotropy>0,H=M.clearcoat>0,j=M.dispersion>0,Q=M.iridescence>0,K=M.sheen>0,Et=M.transmission>0,ht=E&&!!M.anisotropyMap,_t=H&&!!M.clearcoatMap,Wt=H&&!!M.clearcoatNormalMap,nt=H&&!!M.clearcoatRoughnessMap,vt=Q&&!!M.iridescenceMap,te=Q&&!!M.iridescenceThicknessMap,Vt=K&&!!M.sheenColorMap,St=K&&!!M.sheenRoughnessMap,Gt=!!M.specularMap,Jt=!!M.specularColorMap,ve=!!M.specularIntensityMap,B=Et&&!!M.transmissionMap,rt=Et&&!!M.thicknessMap,Z=!!M.gradientMap,J=!!M.alphaMap,ct=M.alphaTest>0,Ut=!!M.alphaHash,ee=!!M.extensions,De=zn;M.toneMapped&&(ft===null||ft.isXRRenderTarget===!0)&&(De=r.toneMapping);let qe={shaderID:st,shaderType:M.type,shaderName:M.name,vertexShader:qt,fragmentShader:q,defines:M.defines,customVertexShaderID:et,customFragmentShaderID:bt,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:d,batching:$t,batchingColor:$t&&F._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&F.instanceColor!==null,instancingMorph:Ot&&F.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:ft===null?r.outputColorSpace:ft.isXRRenderTarget===!0?ft.texture.colorSpace:Wn,alphaToCoverage:!!M.alphaToCoverage,map:zt,matcap:ie,envMap:P,envMapMode:P&&$.mapping,envMapCubeUVHeight:W,aoMap:it,lightMap:tt,bumpMap:pt,normalMap:Y,displacementMap:u&&Ct,emissiveMap:mt,normalMapObjectSpace:Y&&M.normalMapType===h0,normalMapTangentSpace:Y&&M.normalMapType===Vi,metalnessMap:Mt,roughnessMap:L,anisotropy:E,anisotropyMap:ht,clearcoat:H,clearcoatMap:_t,clearcoatNormalMap:Wt,clearcoatRoughnessMap:nt,dispersion:j,iridescence:Q,iridescenceMap:vt,iridescenceThicknessMap:te,sheen:K,sheenColorMap:Vt,sheenRoughnessMap:St,specularMap:Gt,specularColorMap:Jt,specularIntensityMap:ve,transmission:Et,transmissionMap:B,thicknessMap:rt,gradientMap:Z,opaque:M.transparent===!1&&M.blending===On&&M.alphaToCoverage===!1,alphaMap:J,alphaTest:ct,alphaHash:Ut,combine:M.combine,mapUv:zt&&x(M.map.channel),aoMapUv:it&&x(M.aoMap.channel),lightMapUv:tt&&x(M.lightMap.channel),bumpMapUv:pt&&x(M.bumpMap.channel),normalMapUv:Y&&x(M.normalMap.channel),displacementMapUv:Ct&&x(M.displacementMap.channel),emissiveMapUv:mt&&x(M.emissiveMap.channel),metalnessMapUv:Mt&&x(M.metalnessMap.channel),roughnessMapUv:L&&x(M.roughnessMap.channel),anisotropyMapUv:ht&&x(M.anisotropyMap.channel),clearcoatMapUv:_t&&x(M.clearcoatMap.channel),clearcoatNormalMapUv:Wt&&x(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nt&&x(M.clearcoatRoughnessMap.channel),iridescenceMapUv:vt&&x(M.iridescenceMap.channel),iridescenceThicknessMapUv:te&&x(M.iridescenceThicknessMap.channel),sheenColorMapUv:Vt&&x(M.sheenColorMap.channel),sheenRoughnessMapUv:St&&x(M.sheenRoughnessMap.channel),specularMapUv:Gt&&x(M.specularMap.channel),specularColorMapUv:Jt&&x(M.specularColorMap.channel),specularIntensityMapUv:ve&&x(M.specularIntensityMap.channel),transmissionMapUv:B&&x(M.transmissionMap.channel),thicknessMapUv:rt&&x(M.thicknessMap.channel),alphaMapUv:J&&x(M.alphaMap.channel),vertexTangents:!!k.attributes.tangent&&(Y||E),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!k.attributes.uv&&(zt||J),fog:!!N,useFog:M.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:M.flatShading===!0,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:F.isSkinnedMesh===!0,morphTargets:k.morphAttributes.position!==void 0,morphNormals:k.morphAttributes.normal!==void 0,morphColors:k.morphAttributes.color!==void 0,morphTargetsCount:gt,morphTextureStride:Pt,numDirLights:b.directional.length,numPointLights:b.point.length,numSpotLights:b.spot.length,numSpotLightMaps:b.spotLightMap.length,numRectAreaLights:b.rectArea.length,numHemiLights:b.hemi.length,numDirLightShadows:b.directionalShadowMap.length,numPointLightShadows:b.pointShadowMap.length,numSpotLightShadows:b.spotShadowMap.length,numSpotLightShadowsWithMaps:b.numSpotLightShadowsWithMaps,numLightProbes:b.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:M.dithering,shadowMapEnabled:r.shadowMap.enabled&&I.length>0,shadowMapType:r.shadowMap.type,toneMapping:De,decodeVideoTexture:zt&&M.map.isVideoTexture===!0&&se.getTransfer(M.map.colorSpace)===pe,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===dn,flipSided:M.side===Ie,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:ee&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ee&&M.extensions.multiDraw===!0||$t)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return qe.vertexUv1s=l.has(1),qe.vertexUv2s=l.has(2),qe.vertexUv3s=l.has(3),l.clear(),qe}function m(M){let b=[];if(M.shaderID?b.push(M.shaderID):(b.push(M.customVertexShaderID),b.push(M.customFragmentShaderID)),M.defines!==void 0)for(let I in M.defines)b.push(I),b.push(M.defines[I]);return M.isRawShaderMaterial===!1&&(_(b,M),v(b,M),b.push(r.outputColorSpace)),b.push(M.customProgramCacheKey),b.join()}function _(M,b){M.push(b.precision),M.push(b.outputColorSpace),M.push(b.envMapMode),M.push(b.envMapCubeUVHeight),M.push(b.mapUv),M.push(b.alphaMapUv),M.push(b.lightMapUv),M.push(b.aoMapUv),M.push(b.bumpMapUv),M.push(b.normalMapUv),M.push(b.displacementMapUv),M.push(b.emissiveMapUv),M.push(b.metalnessMapUv),M.push(b.roughnessMapUv),M.push(b.anisotropyMapUv),M.push(b.clearcoatMapUv),M.push(b.clearcoatNormalMapUv),M.push(b.clearcoatRoughnessMapUv),M.push(b.iridescenceMapUv),M.push(b.iridescenceThicknessMapUv),M.push(b.sheenColorMapUv),M.push(b.sheenRoughnessMapUv),M.push(b.specularMapUv),M.push(b.specularColorMapUv),M.push(b.specularIntensityMapUv),M.push(b.transmissionMapUv),M.push(b.thicknessMapUv),M.push(b.combine),M.push(b.fogExp2),M.push(b.sizeAttenuation),M.push(b.morphTargetsCount),M.push(b.morphAttributeCount),M.push(b.numDirLights),M.push(b.numPointLights),M.push(b.numSpotLights),M.push(b.numSpotLightMaps),M.push(b.numHemiLights),M.push(b.numRectAreaLights),M.push(b.numDirLightShadows),M.push(b.numPointLightShadows),M.push(b.numSpotLightShadows),M.push(b.numSpotLightShadowsWithMaps),M.push(b.numLightProbes),M.push(b.shadowMapType),M.push(b.toneMapping),M.push(b.numClippingPlanes),M.push(b.numClipIntersection),M.push(b.depthPacking)}function v(M,b){a.disableAll(),b.supportsVertexTextures&&a.enable(0),b.instancing&&a.enable(1),b.instancingColor&&a.enable(2),b.instancingMorph&&a.enable(3),b.matcap&&a.enable(4),b.envMap&&a.enable(5),b.normalMapObjectSpace&&a.enable(6),b.normalMapTangentSpace&&a.enable(7),b.clearcoat&&a.enable(8),b.iridescence&&a.enable(9),b.alphaTest&&a.enable(10),b.vertexColors&&a.enable(11),b.vertexAlphas&&a.enable(12),b.vertexUv1s&&a.enable(13),b.vertexUv2s&&a.enable(14),b.vertexUv3s&&a.enable(15),b.vertexTangents&&a.enable(16),b.anisotropy&&a.enable(17),b.alphaHash&&a.enable(18),b.batching&&a.enable(19),b.dispersion&&a.enable(20),b.batchingColor&&a.enable(21),M.push(a.mask),a.disableAll(),b.fog&&a.enable(0),b.useFog&&a.enable(1),b.flatShading&&a.enable(2),b.logarithmicDepthBuffer&&a.enable(3),b.skinning&&a.enable(4),b.morphTargets&&a.enable(5),b.morphNormals&&a.enable(6),b.morphColors&&a.enable(7),b.premultipliedAlpha&&a.enable(8),b.shadowMapEnabled&&a.enable(9),b.doubleSided&&a.enable(10),b.flipSided&&a.enable(11),b.useDepthPacking&&a.enable(12),b.dithering&&a.enable(13),b.transmission&&a.enable(14),b.sheen&&a.enable(15),b.opaque&&a.enable(16),b.pointsUvs&&a.enable(17),b.decodeVideoTexture&&a.enable(18),b.alphaToCoverage&&a.enable(19),M.push(a.mask)}function y(M){let b=g[M.type],I;if(b){let D=Un[b];I=S0.clone(D.uniforms)}else I=M.uniforms;return I}function w(M,b){let I;for(let D=0,F=h.length;D<F;D++){let N=h[D];if(N.cacheKey===b){I=N,++I.usedTimes;break}}return I===void 0&&(I=new QS(r,b,M,s),h.push(I)),I}function S(M){if(--M.usedTimes===0){let b=h.indexOf(M);h[b]=h[h.length-1],h.pop(),M.destroy()}}function T(M){c.remove(M)}function A(){c.dispose()}return{getParameters:p,getProgramCacheKey:m,getUniforms:y,acquireProgram:w,releaseProgram:S,releaseShaderCache:T,programs:h,dispose:A}}function eT(){let r=new WeakMap;function t(s){let o=r.get(s);return o===void 0&&(o={},r.set(s,o)),o}function e(s){r.delete(s)}function n(s,o,a){r.get(s)[o]=a}function i(){r=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function nT(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.z!==t.z?r.z-t.z:r.id-t.id}function Rm(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function Cm(){let r=[],t=0,e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function o(f,u,d,g,x,p){let m=r[t];return m===void 0?(m={id:f.id,object:f,geometry:u,material:d,groupOrder:g,renderOrder:f.renderOrder,z:x,group:p},r[t]=m):(m.id=f.id,m.object=f,m.geometry=u,m.material=d,m.groupOrder=g,m.renderOrder=f.renderOrder,m.z=x,m.group=p),t++,m}function a(f,u,d,g,x,p){let m=o(f,u,d,g,x,p);d.transmission>0?n.push(m):d.transparent===!0?i.push(m):e.push(m)}function c(f,u,d,g,x,p){let m=o(f,u,d,g,x,p);d.transmission>0?n.unshift(m):d.transparent===!0?i.unshift(m):e.unshift(m)}function l(f,u){e.length>1&&e.sort(f||nT),n.length>1&&n.sort(u||Rm),i.length>1&&i.sort(u||Rm)}function h(){for(let f=t,u=r.length;f<u;f++){let d=r[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:a,unshift:c,finish:h,sort:l}}function iT(){let r=new WeakMap;function t(n,i){let s=r.get(n),o;return s===void 0?(o=new Cm,r.set(n,[o])):i>=s.length?(o=new Cm,s.push(o)):o=s[i],o}function e(){r=new WeakMap}return{get:t,dispose:e}}function rT(){let r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new at};break;case"SpotLight":e={position:new R,direction:new R,color:new at,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new at,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new at,groundColor:new at};break;case"RectAreaLight":e={color:new at,position:new R,halfWidth:new R,halfHeight:new R};break}return r[t.id]=e,e}}}function sT(){let r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new X,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}var oT=0;function aT(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function cT(r){let t=new rT,e=sT(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new R);let i=new R,s=new dt,o=new dt;function a(l){let h=0,f=0,u=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let d=0,g=0,x=0,p=0,m=0,_=0,v=0,y=0,w=0,S=0,T=0;l.sort(aT);for(let M=0,b=l.length;M<b;M++){let I=l[M],D=I.color,F=I.intensity,N=I.distance,k=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)h+=D.r*F,f+=D.g*F,u+=D.b*F;else if(I.isLightProbe){for(let U=0;U<9;U++)n.probe[U].addScaledVector(I.sh.coefficients[U],F);T++}else if(I.isDirectionalLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){let $=I.shadow,W=e.get(I);W.shadowIntensity=$.intensity,W.shadowBias=$.bias,W.shadowNormalBias=$.normalBias,W.shadowRadius=$.radius,W.shadowMapSize=$.mapSize,n.directionalShadow[d]=W,n.directionalShadowMap[d]=k,n.directionalShadowMatrix[d]=I.shadow.matrix,_++}n.directional[d]=U,d++}else if(I.isSpotLight){let U=t.get(I);U.position.setFromMatrixPosition(I.matrixWorld),U.color.copy(D).multiplyScalar(F),U.distance=N,U.coneCos=Math.cos(I.angle),U.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),U.decay=I.decay,n.spot[x]=U;let $=I.shadow;if(I.map&&(n.spotLightMap[w]=I.map,w++,$.updateMatrices(I),I.castShadow&&S++),n.spotLightMatrix[x]=$.matrix,I.castShadow){let W=e.get(I);W.shadowIntensity=$.intensity,W.shadowBias=$.bias,W.shadowNormalBias=$.normalBias,W.shadowRadius=$.radius,W.shadowMapSize=$.mapSize,n.spotShadow[x]=W,n.spotShadowMap[x]=k,y++}x++}else if(I.isRectAreaLight){let U=t.get(I);U.color.copy(D).multiplyScalar(F),U.halfWidth.set(I.width*.5,0,0),U.halfHeight.set(0,I.height*.5,0),n.rectArea[p]=U,p++}else if(I.isPointLight){let U=t.get(I);if(U.color.copy(I.color).multiplyScalar(I.intensity),U.distance=I.distance,U.decay=I.decay,I.castShadow){let $=I.shadow,W=e.get(I);W.shadowIntensity=$.intensity,W.shadowBias=$.bias,W.shadowNormalBias=$.normalBias,W.shadowRadius=$.radius,W.shadowMapSize=$.mapSize,W.shadowCameraNear=$.camera.near,W.shadowCameraFar=$.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=k,n.pointShadowMatrix[g]=I.shadow.matrix,v++}n.point[g]=U,g++}else if(I.isHemisphereLight){let U=t.get(I);U.skyColor.copy(I.color).multiplyScalar(F),U.groundColor.copy(I.groundColor).multiplyScalar(F),n.hemi[m]=U,m++}}p>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ut.LTC_FLOAT_1,n.rectAreaLTC2=ut.LTC_FLOAT_2):(n.rectAreaLTC1=ut.LTC_HALF_1,n.rectAreaLTC2=ut.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;let A=n.hash;(A.directionalLength!==d||A.pointLength!==g||A.spotLength!==x||A.rectAreaLength!==p||A.hemiLength!==m||A.numDirectionalShadows!==_||A.numPointShadows!==v||A.numSpotShadows!==y||A.numSpotMaps!==w||A.numLightProbes!==T)&&(n.directional.length=d,n.spot.length=x,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=_,n.directionalShadowMap.length=_,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=_,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=y+w-S,n.spotLightMap.length=w,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=T,A.directionalLength=d,A.pointLength=g,A.spotLength=x,A.rectAreaLength=p,A.hemiLength=m,A.numDirectionalShadows=_,A.numPointShadows=v,A.numSpotShadows=y,A.numSpotMaps=w,A.numLightProbes=T,n.version=oT++)}function c(l,h){let f=0,u=0,d=0,g=0,x=0,p=h.matrixWorldInverse;for(let m=0,_=l.length;m<_;m++){let v=l[m];if(v.isDirectionalLight){let y=n.directional[f];y.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),f++}else if(v.isSpotLight){let y=n.spot[d];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(p),y.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(p),d++}else if(v.isRectAreaLight){let y=n.rectArea[g];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(p),o.identity(),s.copy(v.matrixWorld),s.premultiply(p),o.extractRotation(s),y.halfWidth.set(v.width*.5,0,0),y.halfHeight.set(0,v.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){let y=n.point[u];y.position.setFromMatrixPosition(v.matrixWorld),y.position.applyMatrix4(p),u++}else if(v.isHemisphereLight){let y=n.hemi[x];y.direction.setFromMatrixPosition(v.matrixWorld),y.direction.transformDirection(p),x++}}}return{setup:a,setupView:c,state:n}}function Im(r){let t=new cT(r),e=[],n=[];function i(h){l.camera=h,e.length=0,n.length=0}function s(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}let l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:s,pushShadow:o}}function lT(r){let t=new WeakMap;function e(i,s=0){let o=t.get(i),a;return o===void 0?(a=new Im(r),t.set(i,[a])):s>=o.length?(a=new Im(r),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}var Ho=class extends We{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=l0,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Go=class extends We{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},uT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function fT(r,t,e){let n=new vr,i=new X,s=new X,o=new Kt,a=new Ho({depthPacking:u0}),c=new Go,l={},h=e.maxTextureSize,f={[pn]:Ie,[Ie]:pn,[dn]:dn},u=new Pe({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new X},radius:{value:4}},vertexShader:uT,fragmentShader:hT}),d=u.clone();d.defines.HORIZONTAL_PASS=1;let g=new Rt;g.setAttribute("position",new Ft(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new Zt(g,u),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Id;let m=this.type;this.render=function(S,T,A){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;let M=r.getRenderTarget(),b=r.getActiveCubeFace(),I=r.getActiveMipmapLevel(),D=r.state;D.setBlending(Ne),D.buffers.color.setClear(1,1,1,1),D.buffers.depth.setTest(!0),D.setScissorTest(!1);let F=m!==$n&&this.type===$n,N=m===$n&&this.type!==$n;for(let k=0,U=S.length;k<U;k++){let $=S[k],W=$.shadow;if(W===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;i.copy(W.mapSize);let st=W.getFrameExtents();if(i.multiply(st),s.copy(W.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(s.x=Math.floor(h/st.x),i.x=s.x*st.x,W.mapSize.x=s.x),i.y>h&&(s.y=Math.floor(h/st.y),i.y=s.y*st.y,W.mapSize.y=s.y)),W.map===null||F===!0||N===!0){let gt=this.type!==$n?{minFilter:Nt,magFilter:Nt}:{};W.map!==null&&W.map.dispose(),W.map=new be(i.x,i.y,gt),W.map.texture.name=$.name+".shadowMap",W.camera.updateProjectionMatrix()}r.setRenderTarget(W.map),r.clear();let lt=W.getViewportCount();for(let gt=0;gt<lt;gt++){let Pt=W.getViewport(gt);o.set(s.x*Pt.x,s.y*Pt.y,s.x*Pt.z,s.y*Pt.w),D.viewport(o),W.updateMatrices($,gt),n=W.getFrustum(),y(T,A,W.camera,$,this.type)}W.isPointLightShadow!==!0&&this.type===$n&&_(W,A),W.needsUpdate=!1}m=this.type,p.needsUpdate=!1,r.setRenderTarget(M,b,I)};function _(S,T){let A=t.update(x);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new be(i.x,i.y)),u.uniforms.shadow_pass.value=S.map.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,r.setRenderTarget(S.mapPass),r.clear(),r.renderBufferDirect(T,null,A,u,x,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value=S.mapSize,d.uniforms.radius.value=S.radius,r.setRenderTarget(S.map),r.clear(),r.renderBufferDirect(T,null,A,d,x,null)}function v(S,T,A,M){let b=null,I=A.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(I!==void 0)b=I;else if(b=A.isPointLight===!0?c:a,r.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){let D=b.uuid,F=T.uuid,N=l[D];N===void 0&&(N={},l[D]=N);let k=N[F];k===void 0&&(k=b.clone(),N[F]=k,T.addEventListener("dispose",w)),b=k}if(b.visible=T.visible,b.wireframe=T.wireframe,M===$n?b.side=T.shadowSide!==null?T.shadowSide:T.side:b.side=T.shadowSide!==null?T.shadowSide:f[T.side],b.alphaMap=T.alphaMap,b.alphaTest=T.alphaTest,b.map=T.map,b.clipShadows=T.clipShadows,b.clippingPlanes=T.clippingPlanes,b.clipIntersection=T.clipIntersection,b.displacementMap=T.displacementMap,b.displacementScale=T.displacementScale,b.displacementBias=T.displacementBias,b.wireframeLinewidth=T.wireframeLinewidth,b.linewidth=T.linewidth,A.isPointLight===!0&&b.isMeshDistanceMaterial===!0){let D=r.properties.get(b);D.light=A}return b}function y(S,T,A,M,b){if(S.visible===!1)return;if(S.layers.test(T.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&b===$n)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(A.matrixWorldInverse,S.matrixWorld);let F=t.update(S),N=S.material;if(Array.isArray(N)){let k=F.groups;for(let U=0,$=k.length;U<$;U++){let W=k[U],st=N[W.materialIndex];if(st&&st.visible){let lt=v(S,st,M,b);S.onBeforeShadow(r,S,T,A,F,lt,W),r.renderBufferDirect(A,null,F,lt,S,W),S.onAfterShadow(r,S,T,A,F,lt,W)}}}else if(N.visible){let k=v(S,N,M,b);S.onBeforeShadow(r,S,T,A,F,k,null),r.renderBufferDirect(A,null,F,k,S,null),S.onAfterShadow(r,S,T,A,F,k,null)}}let D=S.children;for(let F=0,N=D.length;F<N;F++)y(D[F],T,A,M,b)}function w(S){S.target.removeEventListener("dispose",w);for(let A in l){let M=l[A],b=S.target.uuid;b in M&&(M[b].dispose(),delete M[b])}}}function dT(r){function t(){let B=!1,rt=new Kt,Z=null,J=new Kt(0,0,0,0);return{setMask:function(ct){Z!==ct&&!B&&(r.colorMask(ct,ct,ct,ct),Z=ct)},setLocked:function(ct){B=ct},setClear:function(ct,Ut,ee,De,qe){qe===!0&&(ct*=De,Ut*=De,ee*=De),rt.set(ct,Ut,ee,De),J.equals(rt)===!1&&(r.clearColor(ct,Ut,ee,De),J.copy(rt))},reset:function(){B=!1,Z=null,J.set(-1,0,0,0)}}}function e(){let B=!1,rt=null,Z=null,J=null;return{setTest:function(ct){ct?bt(r.DEPTH_TEST):ft(r.DEPTH_TEST)},setMask:function(ct){rt!==ct&&!B&&(r.depthMask(ct),rt=ct)},setFunc:function(ct){if(Z!==ct){switch(ct){case Gg:r.depthFunc(r.NEVER);break;case Wg:r.depthFunc(r.ALWAYS);break;case Xg:r.depthFunc(r.LESS);break;case Ao:r.depthFunc(r.LEQUAL);break;case qg:r.depthFunc(r.EQUAL);break;case Yg:r.depthFunc(r.GEQUAL);break;case $g:r.depthFunc(r.GREATER);break;case Zg:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}Z=ct}},setLocked:function(ct){B=ct},setClear:function(ct){J!==ct&&(r.clearDepth(ct),J=ct)},reset:function(){B=!1,rt=null,Z=null,J=null}}}function n(){let B=!1,rt=null,Z=null,J=null,ct=null,Ut=null,ee=null,De=null,qe=null;return{setTest:function(ae){B||(ae?bt(r.STENCIL_TEST):ft(r.STENCIL_TEST))},setMask:function(ae){rt!==ae&&!B&&(r.stencilMask(ae),rt=ae)},setFunc:function(ae,ni,Yn){(Z!==ae||J!==ni||ct!==Yn)&&(r.stencilFunc(ae,ni,Yn),Z=ae,J=ni,ct=Yn)},setOp:function(ae,ni,Yn){(Ut!==ae||ee!==ni||De!==Yn)&&(r.stencilOp(ae,ni,Yn),Ut=ae,ee=ni,De=Yn)},setLocked:function(ae){B=ae},setClear:function(ae){qe!==ae&&(r.clearStencil(ae),qe=ae)},reset:function(){B=!1,rt=null,Z=null,J=null,ct=null,Ut=null,ee=null,De=null,qe=null}}}let i=new t,s=new e,o=new n,a=new WeakMap,c=new WeakMap,l={},h={},f=new WeakMap,u=[],d=null,g=!1,x=null,p=null,m=null,_=null,v=null,y=null,w=null,S=new at(0,0,0),T=0,A=!1,M=null,b=null,I=null,D=null,F=null,N=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,U=0,$=r.getParameter(r.VERSION);$.indexOf("WebGL")!==-1?(U=parseFloat(/^WebGL (\d)/.exec($)[1]),k=U>=1):$.indexOf("OpenGL ES")!==-1&&(U=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),k=U>=2);let W=null,st={},lt=r.getParameter(r.SCISSOR_BOX),gt=r.getParameter(r.VIEWPORT),Pt=new Kt().fromArray(lt),qt=new Kt().fromArray(gt);function q(B,rt,Z,J){let ct=new Uint8Array(4),Ut=r.createTexture();r.bindTexture(B,Ut),r.texParameteri(B,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(B,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let ee=0;ee<Z;ee++)B===r.TEXTURE_3D||B===r.TEXTURE_2D_ARRAY?r.texImage3D(rt,0,r.RGBA,1,1,J,0,r.RGBA,r.UNSIGNED_BYTE,ct):r.texImage2D(rt+ee,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ct);return Ut}let et={};et[r.TEXTURE_2D]=q(r.TEXTURE_2D,r.TEXTURE_2D,1),et[r.TEXTURE_CUBE_MAP]=q(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),et[r.TEXTURE_2D_ARRAY]=q(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),et[r.TEXTURE_3D]=q(r.TEXTURE_3D,r.TEXTURE_3D,1,1),i.setClear(0,0,0,1),s.setClear(1),o.setClear(0),bt(r.DEPTH_TEST),s.setFunc(Ao),pt(!1),Y(uf),bt(r.CULL_FACE),it(Ne);function bt(B){l[B]!==!0&&(r.enable(B),l[B]=!0)}function ft(B){l[B]!==!1&&(r.disable(B),l[B]=!1)}function Ot(B,rt){return h[B]!==rt?(r.bindFramebuffer(B,rt),h[B]=rt,B===r.DRAW_FRAMEBUFFER&&(h[r.FRAMEBUFFER]=rt),B===r.FRAMEBUFFER&&(h[r.DRAW_FRAMEBUFFER]=rt),!0):!1}function $t(B,rt){let Z=u,J=!1;if(B){Z=f.get(rt),Z===void 0&&(Z=[],f.set(rt,Z));let ct=B.textures;if(Z.length!==ct.length||Z[0]!==r.COLOR_ATTACHMENT0){for(let Ut=0,ee=ct.length;Ut<ee;Ut++)Z[Ut]=r.COLOR_ATTACHMENT0+Ut;Z.length=ct.length,J=!0}}else Z[0]!==r.BACK&&(Z[0]=r.BACK,J=!0);J&&r.drawBuffers(Z)}function zt(B){return d!==B?(r.useProgram(B),d=B,!0):!1}let ie={[Ei]:r.FUNC_ADD,[Ag]:r.FUNC_SUBTRACT,[Eg]:r.FUNC_REVERSE_SUBTRACT};ie[Rg]=r.MIN,ie[Cg]=r.MAX;let P={[Ig]:r.ZERO,[Pg]:r.ONE,[Dg]:r.SRC_COLOR,[Sc]:r.SRC_ALPHA,[Og]:r.SRC_ALPHA_SATURATE,[Ug]:r.DST_COLOR,[Fg]:r.DST_ALPHA,[Lg]:r.ONE_MINUS_SRC_COLOR,[Tc]:r.ONE_MINUS_SRC_ALPHA,[Bg]:r.ONE_MINUS_DST_COLOR,[Ng]:r.ONE_MINUS_DST_ALPHA,[zg]:r.CONSTANT_COLOR,[kg]:r.ONE_MINUS_CONSTANT_COLOR,[Vg]:r.CONSTANT_ALPHA,[Hg]:r.ONE_MINUS_CONSTANT_ALPHA};function it(B,rt,Z,J,ct,Ut,ee,De,qe,ae){if(B===Ne){g===!0&&(ft(r.BLEND),g=!1);return}if(g===!1&&(bt(r.BLEND),g=!0),B!==wg){if(B!==x||ae!==A){if((p!==Ei||v!==Ei)&&(r.blendEquation(r.FUNC_ADD),p=Ei,v=Ei),ae)switch(B){case On:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case wo:r.blendFunc(r.ONE,r.ONE);break;case hf:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ff:r.blendFuncSeparate(r.ZERO,r.SRC_COLOR,r.ZERO,r.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case On:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case wo:r.blendFunc(r.SRC_ALPHA,r.ONE);break;case hf:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case ff:r.blendFunc(r.ZERO,r.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}m=null,_=null,y=null,w=null,S.set(0,0,0),T=0,x=B,A=ae}return}ct=ct||rt,Ut=Ut||Z,ee=ee||J,(rt!==p||ct!==v)&&(r.blendEquationSeparate(ie[rt],ie[ct]),p=rt,v=ct),(Z!==m||J!==_||Ut!==y||ee!==w)&&(r.blendFuncSeparate(P[Z],P[J],P[Ut],P[ee]),m=Z,_=J,y=Ut,w=ee),(De.equals(S)===!1||qe!==T)&&(r.blendColor(De.r,De.g,De.b,qe),S.copy(De),T=qe),x=B,A=!1}function tt(B,rt){B.side===dn?ft(r.CULL_FACE):bt(r.CULL_FACE);let Z=B.side===Ie;rt&&(Z=!Z),pt(Z),B.blending===On&&B.transparent===!1?it(Ne):it(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),s.setFunc(B.depthFunc),s.setTest(B.depthTest),s.setMask(B.depthWrite),i.setMask(B.colorWrite);let J=B.stencilWrite;o.setTest(J),J&&(o.setMask(B.stencilWriteMask),o.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),o.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),mt(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?bt(r.SAMPLE_ALPHA_TO_COVERAGE):ft(r.SAMPLE_ALPHA_TO_COVERAGE)}function pt(B){M!==B&&(B?r.frontFace(r.CW):r.frontFace(r.CCW),M=B)}function Y(B){B!==Mg?(bt(r.CULL_FACE),B!==b&&(B===uf?r.cullFace(r.BACK):B===Sg?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):ft(r.CULL_FACE),b=B}function Ct(B){B!==I&&(k&&r.lineWidth(B),I=B)}function mt(B,rt,Z){B?(bt(r.POLYGON_OFFSET_FILL),(D!==rt||F!==Z)&&(r.polygonOffset(rt,Z),D=rt,F=Z)):ft(r.POLYGON_OFFSET_FILL)}function Mt(B){B?bt(r.SCISSOR_TEST):ft(r.SCISSOR_TEST)}function L(B){B===void 0&&(B=r.TEXTURE0+N-1),W!==B&&(r.activeTexture(B),W=B)}function E(B,rt,Z){Z===void 0&&(W===null?Z=r.TEXTURE0+N-1:Z=W);let J=st[Z];J===void 0&&(J={type:void 0,texture:void 0},st[Z]=J),(J.type!==B||J.texture!==rt)&&(W!==Z&&(r.activeTexture(Z),W=Z),r.bindTexture(B,rt||et[B]),J.type=B,J.texture=rt)}function H(){let B=st[W];B!==void 0&&B.type!==void 0&&(r.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function j(){try{r.compressedTexImage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Q(){try{r.compressedTexImage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function K(){try{r.texSubImage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Et(){try{r.texSubImage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function ht(){try{r.compressedTexSubImage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function _t(){try{r.compressedTexSubImage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Wt(){try{r.texStorage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function nt(){try{r.texStorage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function vt(){try{r.texImage2D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function te(){try{r.texImage3D.apply(r,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Vt(B){Pt.equals(B)===!1&&(r.scissor(B.x,B.y,B.z,B.w),Pt.copy(B))}function St(B){qt.equals(B)===!1&&(r.viewport(B.x,B.y,B.z,B.w),qt.copy(B))}function Gt(B,rt){let Z=c.get(rt);Z===void 0&&(Z=new WeakMap,c.set(rt,Z));let J=Z.get(B);J===void 0&&(J=r.getUniformBlockIndex(rt,B.name),Z.set(B,J))}function Jt(B,rt){let J=c.get(rt).get(B);a.get(rt)!==J&&(r.uniformBlockBinding(rt,J,B.__bindingPointIndex),a.set(rt,J))}function ve(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),l={},W=null,st={},h={},f=new WeakMap,u=[],d=null,g=!1,x=null,p=null,m=null,_=null,v=null,y=null,w=null,S=new at(0,0,0),T=0,A=!1,M=null,b=null,I=null,D=null,F=null,Pt.set(0,0,r.canvas.width,r.canvas.height),qt.set(0,0,r.canvas.width,r.canvas.height),i.reset(),s.reset(),o.reset()}return{buffers:{color:i,depth:s,stencil:o},enable:bt,disable:ft,bindFramebuffer:Ot,drawBuffers:$t,useProgram:zt,setBlending:it,setMaterial:tt,setFlipSided:pt,setCullFace:Y,setLineWidth:Ct,setPolygonOffset:mt,setScissorTest:Mt,activeTexture:L,bindTexture:E,unbindTexture:H,compressedTexImage2D:j,compressedTexImage3D:Q,texImage2D:vt,texImage3D:te,updateUBOMapping:Gt,uniformBlockBinding:Jt,texStorage2D:Wt,texStorage3D:nt,texSubImage2D:K,texSubImage3D:Et,compressedTexSubImage2D:ht,compressedTexSubImage3D:_t,scissor:Vt,viewport:St,reset:ve}}function pT(r,t){let e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2):(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0),r}function mT(r,t){let e=r.image&&r.image.width?r.image.width/r.image.height:1;return e>t?(r.repeat.x=t/e,r.repeat.y=1,r.offset.x=(1-r.repeat.x)/2,r.offset.y=0):(r.repeat.x=1,r.repeat.y=e/t,r.offset.x=0,r.offset.y=(1-r.repeat.y)/2),r}function gT(r){return r.repeat.x=1,r.repeat.y=1,r.offset.x=0,r.offset.y=0,r}function Cf(r,t,e,n){let i=xT(n);switch(e){case Fd:return r*t;case Ud:return r*t;case Bd:return r*t*2;case Gn:return r*t/i.components*i.byteLength;case Cr:return r*t/i.components*i.byteLength;case Ir:return r*t*2/i.components*i.byteLength;case zi:return r*t*2/i.components*i.byteLength;case Nd:return r*t*3/i.components*i.byteLength;case Lt:return r*t*4/i.components*i.byteLength;case ki:return r*t*4/i.components*i.byteLength;case go:case xo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case vo:case _o:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Ac:case Rc:return Math.max(r,16)*Math.max(t,8)/4;case wc:case Ec:return Math.max(r,8)*Math.max(t,8)/2;case Cc:case Ic:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case Pc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Dc:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case Lc:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Fc:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case Nc:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case Uc:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case Bc:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case Oc:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case zc:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case kc:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case Vc:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case Hc:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Gc:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case Wc:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Xc:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case yo:case qc:case Yc:return Math.ceil(r/4)*Math.ceil(t/4)*16;case Od:case $c:return Math.ceil(r/4)*Math.ceil(t/4)*8;case Zc:case Jc:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function xT(r){switch(r){case cn:case As:return{byteLength:1,components:1};case Ii:case da:case me:return{byteLength:2,components:1};case su:case ou:return{byteLength:2,components:4};case nn:case Oi:case Dt:return{byteLength:4,components:1};case Ld:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}var vT={contain:pT,cover:mT,fill:gT,getByteLength:Cf};function _T(r,t,e,n,i,s,o){let a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new X,h=new WeakMap,f,u=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(L,E){return d?new OffscreenCanvas(L,E):Uo("canvas")}function x(L,E,H){let j=1,Q=Mt(L);if((Q.width>H||Q.height>H)&&(j=H/Math.max(Q.width,Q.height)),j<1)if(typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&L instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&L instanceof ImageBitmap||typeof VideoFrame<"u"&&L instanceof VideoFrame){let K=Math.floor(j*Q.width),Et=Math.floor(j*Q.height);f===void 0&&(f=g(K,Et));let ht=E?g(K,Et):f;return ht.width=K,ht.height=Et,ht.getContext("2d").drawImage(L,0,0,K,Et),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+K+"x"+Et+")."),ht}else return"data"in L&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),L;return L}function p(L){return L.generateMipmaps&&L.minFilter!==Nt&&L.minFilter!==Qt}function m(L){r.generateMipmap(L)}function _(L,E,H,j,Q=!1){if(L!==null){if(r[L]!==void 0)return r[L];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+L+"'")}let K=E;if(E===r.RED&&(H===r.FLOAT&&(K=r.R32F),H===r.HALF_FLOAT&&(K=r.R16F),H===r.UNSIGNED_BYTE&&(K=r.R8)),E===r.RED_INTEGER&&(H===r.UNSIGNED_BYTE&&(K=r.R8UI),H===r.UNSIGNED_SHORT&&(K=r.R16UI),H===r.UNSIGNED_INT&&(K=r.R32UI),H===r.BYTE&&(K=r.R8I),H===r.SHORT&&(K=r.R16I),H===r.INT&&(K=r.R32I)),E===r.RG&&(H===r.FLOAT&&(K=r.RG32F),H===r.HALF_FLOAT&&(K=r.RG16F),H===r.UNSIGNED_BYTE&&(K=r.RG8)),E===r.RG_INTEGER&&(H===r.UNSIGNED_BYTE&&(K=r.RG8UI),H===r.UNSIGNED_SHORT&&(K=r.RG16UI),H===r.UNSIGNED_INT&&(K=r.RG32UI),H===r.BYTE&&(K=r.RG8I),H===r.SHORT&&(K=r.RG16I),H===r.INT&&(K=r.RG32I)),E===r.RGB&&H===r.UNSIGNED_INT_5_9_9_9_REV&&(K=r.RGB9_E5),E===r.RGBA){let Et=Q?Po:se.getTransfer(j);H===r.FLOAT&&(K=r.RGBA32F),H===r.HALF_FLOAT&&(K=r.RGBA16F),H===r.UNSIGNED_BYTE&&(K=Et===pe?r.SRGB8_ALPHA8:r.RGBA8),H===r.UNSIGNED_SHORT_4_4_4_4&&(K=r.RGBA4),H===r.UNSIGNED_SHORT_5_5_5_1&&(K=r.RGB5_A1)}return(K===r.R16F||K===r.R32F||K===r.RG16F||K===r.RG32F||K===r.RGBA16F||K===r.RGBA32F)&&t.get("EXT_color_buffer_float"),K}function v(L,E){let H;return L?E===null||E===nn||E===mr?H=r.DEPTH24_STENCIL8:E===Dt?H=r.DEPTH32F_STENCIL8:E===Ii&&(H=r.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===nn||E===mr?H=r.DEPTH_COMPONENT24:E===Dt?H=r.DEPTH_COMPONENT32F:E===Ii&&(H=r.DEPTH_COMPONENT16),H}function y(L,E){return p(L)===!0||L.isFramebufferTexture&&L.minFilter!==Nt&&L.minFilter!==Qt?Math.log2(Math.max(E.width,E.height))+1:L.mipmaps!==void 0&&L.mipmaps.length>0?L.mipmaps.length:L.isCompressedTexture&&Array.isArray(L.image)?E.mipmaps.length:1}function w(L){let E=L.target;E.removeEventListener("dispose",w),T(E),E.isVideoTexture&&h.delete(E)}function S(L){let E=L.target;E.removeEventListener("dispose",S),M(E)}function T(L){let E=n.get(L);if(E.__webglInit===void 0)return;let H=L.source,j=u.get(H);if(j){let Q=j[E.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&A(L),Object.keys(j).length===0&&u.delete(H)}n.remove(L)}function A(L){let E=n.get(L);r.deleteTexture(E.__webglTexture);let H=L.source,j=u.get(H);delete j[E.__cacheKey],o.memory.textures--}function M(L){let E=n.get(L);if(L.depthTexture&&L.depthTexture.dispose(),L.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(E.__webglFramebuffer[j]))for(let Q=0;Q<E.__webglFramebuffer[j].length;Q++)r.deleteFramebuffer(E.__webglFramebuffer[j][Q]);else r.deleteFramebuffer(E.__webglFramebuffer[j]);E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer[j])}else{if(Array.isArray(E.__webglFramebuffer))for(let j=0;j<E.__webglFramebuffer.length;j++)r.deleteFramebuffer(E.__webglFramebuffer[j]);else r.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&r.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&r.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let j=0;j<E.__webglColorRenderbuffer.length;j++)E.__webglColorRenderbuffer[j]&&r.deleteRenderbuffer(E.__webglColorRenderbuffer[j]);E.__webglDepthRenderbuffer&&r.deleteRenderbuffer(E.__webglDepthRenderbuffer)}let H=L.textures;for(let j=0,Q=H.length;j<Q;j++){let K=n.get(H[j]);K.__webglTexture&&(r.deleteTexture(K.__webglTexture),o.memory.textures--),n.remove(H[j])}n.remove(L)}let b=0;function I(){b=0}function D(){let L=b;return L>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+L+" texture units while this GPU supports only "+i.maxTextures),b+=1,L}function F(L){let E=[];return E.push(L.wrapS),E.push(L.wrapT),E.push(L.wrapR||0),E.push(L.magFilter),E.push(L.minFilter),E.push(L.anisotropy),E.push(L.internalFormat),E.push(L.format),E.push(L.type),E.push(L.generateMipmaps),E.push(L.premultiplyAlpha),E.push(L.flipY),E.push(L.unpackAlignment),E.push(L.colorSpace),E.join()}function N(L,E){let H=n.get(L);if(L.isVideoTexture&&Ct(L),L.isRenderTargetTexture===!1&&L.version>0&&H.__version!==L.version){let j=L.image;if(j===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{qt(H,L,E);return}}e.bindTexture(r.TEXTURE_2D,H.__webglTexture,r.TEXTURE0+E)}function k(L,E){let H=n.get(L);if(L.version>0&&H.__version!==L.version){qt(H,L,E);return}e.bindTexture(r.TEXTURE_2D_ARRAY,H.__webglTexture,r.TEXTURE0+E)}function U(L,E){let H=n.get(L);if(L.version>0&&H.__version!==L.version){qt(H,L,E);return}e.bindTexture(r.TEXTURE_3D,H.__webglTexture,r.TEXTURE0+E)}function $(L,E){let H=n.get(L);if(L.version>0&&H.__version!==L.version){q(H,L,E);return}e.bindTexture(r.TEXTURE_CUBE_MAP,H.__webglTexture,r.TEXTURE0+E)}let W={[$e]:r.REPEAT,[ge]:r.CLAMP_TO_EDGE,[Ro]:r.MIRRORED_REPEAT},st={[Nt]:r.NEAREST,[Pd]:r.NEAREST_MIPMAP_NEAREST,[os]:r.NEAREST_MIPMAP_LINEAR,[Qt]:r.LINEAR,[mo]:r.LINEAR_MIPMAP_NEAREST,[Zn]:r.LINEAR_MIPMAP_LINEAR},lt={[f0]:r.NEVER,[v0]:r.ALWAYS,[d0]:r.LESS,[kd]:r.LEQUAL,[p0]:r.EQUAL,[x0]:r.GEQUAL,[m0]:r.GREATER,[g0]:r.NOTEQUAL};function gt(L,E){if(E.type===Dt&&t.has("OES_texture_float_linear")===!1&&(E.magFilter===Qt||E.magFilter===mo||E.magFilter===os||E.magFilter===Zn||E.minFilter===Qt||E.minFilter===mo||E.minFilter===os||E.minFilter===Zn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(L,r.TEXTURE_WRAP_S,W[E.wrapS]),r.texParameteri(L,r.TEXTURE_WRAP_T,W[E.wrapT]),(L===r.TEXTURE_3D||L===r.TEXTURE_2D_ARRAY)&&r.texParameteri(L,r.TEXTURE_WRAP_R,W[E.wrapR]),r.texParameteri(L,r.TEXTURE_MAG_FILTER,st[E.magFilter]),r.texParameteri(L,r.TEXTURE_MIN_FILTER,st[E.minFilter]),E.compareFunction&&(r.texParameteri(L,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(L,r.TEXTURE_COMPARE_FUNC,lt[E.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Nt||E.minFilter!==os&&E.minFilter!==Zn||E.type===Dt&&t.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){let H=t.get("EXT_texture_filter_anisotropic");r.texParameterf(L,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,i.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function Pt(L,E){let H=!1;L.__webglInit===void 0&&(L.__webglInit=!0,E.addEventListener("dispose",w));let j=E.source,Q=u.get(j);Q===void 0&&(Q={},u.set(j,Q));let K=F(E);if(K!==L.__cacheKey){Q[K]===void 0&&(Q[K]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,H=!0),Q[K].usedTimes++;let Et=Q[L.__cacheKey];Et!==void 0&&(Q[L.__cacheKey].usedTimes--,Et.usedTimes===0&&A(E)),L.__cacheKey=K,L.__webglTexture=Q[K].texture}return H}function qt(L,E,H){let j=r.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(j=r.TEXTURE_2D_ARRAY),E.isData3DTexture&&(j=r.TEXTURE_3D);let Q=Pt(L,E),K=E.source;e.bindTexture(j,L.__webglTexture,r.TEXTURE0+H);let Et=n.get(K);if(K.version!==Et.__version||Q===!0){e.activeTexture(r.TEXTURE0+H);let ht=se.getPrimaries(se.workingColorSpace),_t=E.colorSpace===li?null:se.getPrimaries(E.colorSpace),Wt=E.colorSpace===li||ht===_t?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,Wt);let nt=x(E.image,!1,i.maxTextureSize);nt=mt(E,nt);let vt=s.convert(E.format,E.colorSpace),te=s.convert(E.type),Vt=_(E.internalFormat,vt,te,E.colorSpace,E.isVideoTexture);gt(j,E);let St,Gt=E.mipmaps,Jt=E.isVideoTexture!==!0,ve=Et.__version===void 0||Q===!0,B=K.dataReady,rt=y(E,nt);if(E.isDepthTexture)Vt=v(E.format===gr,E.type),ve&&(Jt?e.texStorage2D(r.TEXTURE_2D,1,Vt,nt.width,nt.height):e.texImage2D(r.TEXTURE_2D,0,Vt,nt.width,nt.height,0,vt,te,null));else if(E.isDataTexture)if(Gt.length>0){Jt&&ve&&e.texStorage2D(r.TEXTURE_2D,rt,Vt,Gt[0].width,Gt[0].height);for(let Z=0,J=Gt.length;Z<J;Z++)St=Gt[Z],Jt?B&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,St.width,St.height,vt,te,St.data):e.texImage2D(r.TEXTURE_2D,Z,Vt,St.width,St.height,0,vt,te,St.data);E.generateMipmaps=!1}else Jt?(ve&&e.texStorage2D(r.TEXTURE_2D,rt,Vt,nt.width,nt.height),B&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,nt.width,nt.height,vt,te,nt.data)):e.texImage2D(r.TEXTURE_2D,0,Vt,nt.width,nt.height,0,vt,te,nt.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Jt&&ve&&e.texStorage3D(r.TEXTURE_2D_ARRAY,rt,Vt,Gt[0].width,Gt[0].height,nt.depth);for(let Z=0,J=Gt.length;Z<J;Z++)if(St=Gt[Z],E.format!==Lt)if(vt!==null)if(Jt){if(B)if(E.layerUpdates.size>0){let ct=Cf(St.width,St.height,E.format,E.type);for(let Ut of E.layerUpdates){let ee=St.data.subarray(Ut*ct/St.data.BYTES_PER_ELEMENT,(Ut+1)*ct/St.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,Ut,St.width,St.height,1,vt,ee,0,0)}E.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,St.width,St.height,nt.depth,vt,St.data,0,0)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Z,Vt,St.width,St.height,nt.depth,0,St.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Jt?B&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,Z,0,0,0,St.width,St.height,nt.depth,vt,te,St.data):e.texImage3D(r.TEXTURE_2D_ARRAY,Z,Vt,St.width,St.height,nt.depth,0,vt,te,St.data)}else{Jt&&ve&&e.texStorage2D(r.TEXTURE_2D,rt,Vt,Gt[0].width,Gt[0].height);for(let Z=0,J=Gt.length;Z<J;Z++)St=Gt[Z],E.format!==Lt?vt!==null?Jt?B&&e.compressedTexSubImage2D(r.TEXTURE_2D,Z,0,0,St.width,St.height,vt,St.data):e.compressedTexImage2D(r.TEXTURE_2D,Z,Vt,St.width,St.height,0,St.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Jt?B&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,St.width,St.height,vt,te,St.data):e.texImage2D(r.TEXTURE_2D,Z,Vt,St.width,St.height,0,vt,te,St.data)}else if(E.isDataArrayTexture)if(Jt){if(ve&&e.texStorage3D(r.TEXTURE_2D_ARRAY,rt,Vt,nt.width,nt.height,nt.depth),B)if(E.layerUpdates.size>0){let Z=Cf(nt.width,nt.height,E.format,E.type);for(let J of E.layerUpdates){let ct=nt.data.subarray(J*Z/nt.data.BYTES_PER_ELEMENT,(J+1)*Z/nt.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,J,nt.width,nt.height,1,vt,te,ct)}E.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,nt.width,nt.height,nt.depth,vt,te,nt.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,Vt,nt.width,nt.height,nt.depth,0,vt,te,nt.data);else if(E.isData3DTexture)Jt?(ve&&e.texStorage3D(r.TEXTURE_3D,rt,Vt,nt.width,nt.height,nt.depth),B&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,nt.width,nt.height,nt.depth,vt,te,nt.data)):e.texImage3D(r.TEXTURE_3D,0,Vt,nt.width,nt.height,nt.depth,0,vt,te,nt.data);else if(E.isFramebufferTexture){if(ve)if(Jt)e.texStorage2D(r.TEXTURE_2D,rt,Vt,nt.width,nt.height);else{let Z=nt.width,J=nt.height;for(let ct=0;ct<rt;ct++)e.texImage2D(r.TEXTURE_2D,ct,Vt,Z,J,0,vt,te,null),Z>>=1,J>>=1}}else if(Gt.length>0){if(Jt&&ve){let Z=Mt(Gt[0]);e.texStorage2D(r.TEXTURE_2D,rt,Vt,Z.width,Z.height)}for(let Z=0,J=Gt.length;Z<J;Z++)St=Gt[Z],Jt?B&&e.texSubImage2D(r.TEXTURE_2D,Z,0,0,vt,te,St):e.texImage2D(r.TEXTURE_2D,Z,Vt,vt,te,St);E.generateMipmaps=!1}else if(Jt){if(ve){let Z=Mt(nt);e.texStorage2D(r.TEXTURE_2D,rt,Vt,Z.width,Z.height)}B&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,vt,te,nt)}else e.texImage2D(r.TEXTURE_2D,0,Vt,vt,te,nt);p(E)&&m(j),Et.__version=K.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function q(L,E,H){if(E.image.length!==6)return;let j=Pt(L,E),Q=E.source;e.bindTexture(r.TEXTURE_CUBE_MAP,L.__webglTexture,r.TEXTURE0+H);let K=n.get(Q);if(Q.version!==K.__version||j===!0){e.activeTexture(r.TEXTURE0+H);let Et=se.getPrimaries(se.workingColorSpace),ht=E.colorSpace===li?null:se.getPrimaries(E.colorSpace),_t=E.colorSpace===li||Et===ht?r.NONE:r.BROWSER_DEFAULT_WEBGL;r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,E.flipY),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),r.pixelStorei(r.UNPACK_ALIGNMENT,E.unpackAlignment),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,_t);let Wt=E.isCompressedTexture||E.image[0].isCompressedTexture,nt=E.image[0]&&E.image[0].isDataTexture,vt=[];for(let J=0;J<6;J++)!Wt&&!nt?vt[J]=x(E.image[J],!0,i.maxCubemapSize):vt[J]=nt?E.image[J].image:E.image[J],vt[J]=mt(E,vt[J]);let te=vt[0],Vt=s.convert(E.format,E.colorSpace),St=s.convert(E.type),Gt=_(E.internalFormat,Vt,St,E.colorSpace),Jt=E.isVideoTexture!==!0,ve=K.__version===void 0||j===!0,B=Q.dataReady,rt=y(E,te);gt(r.TEXTURE_CUBE_MAP,E);let Z;if(Wt){Jt&&ve&&e.texStorage2D(r.TEXTURE_CUBE_MAP,rt,Gt,te.width,te.height);for(let J=0;J<6;J++){Z=vt[J].mipmaps;for(let ct=0;ct<Z.length;ct++){let Ut=Z[ct];E.format!==Lt?Vt!==null?Jt?B&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,ct,0,0,Ut.width,Ut.height,Vt,Ut.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,ct,Gt,Ut.width,Ut.height,0,Ut.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Jt?B&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,ct,0,0,Ut.width,Ut.height,Vt,St,Ut.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,ct,Gt,Ut.width,Ut.height,0,Vt,St,Ut.data)}}}else{if(Z=E.mipmaps,Jt&&ve){Z.length>0&&rt++;let J=Mt(vt[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,rt,Gt,J.width,J.height)}for(let J=0;J<6;J++)if(nt){Jt?B&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,vt[J].width,vt[J].height,Vt,St,vt[J].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Gt,vt[J].width,vt[J].height,0,Vt,St,vt[J].data);for(let ct=0;ct<Z.length;ct++){let ee=Z[ct].image[J].image;Jt?B&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,ct+1,0,0,ee.width,ee.height,Vt,St,ee.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,ct+1,Gt,ee.width,ee.height,0,Vt,St,ee.data)}}else{Jt?B&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Vt,St,vt[J]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Gt,Vt,St,vt[J]);for(let ct=0;ct<Z.length;ct++){let Ut=Z[ct];Jt?B&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,ct+1,0,0,Vt,St,Ut.image[J]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+J,ct+1,Gt,Vt,St,Ut.image[J])}}}p(E)&&m(r.TEXTURE_CUBE_MAP),K.__version=Q.version,E.onUpdate&&E.onUpdate(E)}L.__version=E.version}function et(L,E,H,j,Q,K){let Et=s.convert(H.format,H.colorSpace),ht=s.convert(H.type),_t=_(H.internalFormat,Et,ht,H.colorSpace);if(!n.get(E).__hasExternalTextures){let nt=Math.max(1,E.width>>K),vt=Math.max(1,E.height>>K);Q===r.TEXTURE_3D||Q===r.TEXTURE_2D_ARRAY?e.texImage3D(Q,K,_t,nt,vt,E.depth,0,Et,ht,null):e.texImage2D(Q,K,_t,nt,vt,0,Et,ht,null)}e.bindFramebuffer(r.FRAMEBUFFER,L),Y(E)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,j,Q,n.get(H).__webglTexture,0,pt(E)):(Q===r.TEXTURE_2D||Q>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,j,Q,n.get(H).__webglTexture,K),e.bindFramebuffer(r.FRAMEBUFFER,null)}function bt(L,E,H){if(r.bindRenderbuffer(r.RENDERBUFFER,L),E.depthBuffer){let j=E.depthTexture,Q=j&&j.isDepthTexture?j.type:null,K=v(E.stencilBuffer,Q),Et=E.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ht=pt(E);Y(E)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,ht,K,E.width,E.height):H?r.renderbufferStorageMultisample(r.RENDERBUFFER,ht,K,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,K,E.width,E.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,Et,r.RENDERBUFFER,L)}else{let j=E.textures;for(let Q=0;Q<j.length;Q++){let K=j[Q],Et=s.convert(K.format,K.colorSpace),ht=s.convert(K.type),_t=_(K.internalFormat,Et,ht,K.colorSpace),Wt=pt(E);H&&Y(E)===!1?r.renderbufferStorageMultisample(r.RENDERBUFFER,Wt,_t,E.width,E.height):Y(E)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Wt,_t,E.width,E.height):r.renderbufferStorage(r.RENDERBUFFER,_t,E.width,E.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function ft(L,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(r.FRAMEBUFFER,L),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),N(E.depthTexture,0);let j=n.get(E.depthTexture).__webglTexture,Q=pt(E);if(E.depthTexture.format===dr)Y(E)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,j,0,Q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_ATTACHMENT,r.TEXTURE_2D,j,0);else if(E.depthTexture.format===gr)Y(E)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,j,0,Q):r.framebufferTexture2D(r.FRAMEBUFFER,r.DEPTH_STENCIL_ATTACHMENT,r.TEXTURE_2D,j,0);else throw new Error("Unknown depthTexture format")}function Ot(L){let E=n.get(L),H=L.isWebGLCubeRenderTarget===!0;if(L.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");ft(E.__webglFramebuffer,L)}else if(H){E.__webglDepthbuffer=[];for(let j=0;j<6;j++)e.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer[j]),E.__webglDepthbuffer[j]=r.createRenderbuffer(),bt(E.__webglDepthbuffer[j],L,!1)}else e.bindFramebuffer(r.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=r.createRenderbuffer(),bt(E.__webglDepthbuffer,L,!1);e.bindFramebuffer(r.FRAMEBUFFER,null)}function $t(L,E,H){let j=n.get(L);E!==void 0&&et(j.__webglFramebuffer,L,L.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),H!==void 0&&Ot(L)}function zt(L){let E=L.texture,H=n.get(L),j=n.get(E);L.addEventListener("dispose",S);let Q=L.textures,K=L.isWebGLCubeRenderTarget===!0,Et=Q.length>1;if(Et||(j.__webglTexture===void 0&&(j.__webglTexture=r.createTexture()),j.__version=E.version,o.memory.textures++),K){H.__webglFramebuffer=[];for(let ht=0;ht<6;ht++)if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[ht]=[];for(let _t=0;_t<E.mipmaps.length;_t++)H.__webglFramebuffer[ht][_t]=r.createFramebuffer()}else H.__webglFramebuffer[ht]=r.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let ht=0;ht<E.mipmaps.length;ht++)H.__webglFramebuffer[ht]=r.createFramebuffer()}else H.__webglFramebuffer=r.createFramebuffer();if(Et)for(let ht=0,_t=Q.length;ht<_t;ht++){let Wt=n.get(Q[ht]);Wt.__webglTexture===void 0&&(Wt.__webglTexture=r.createTexture(),o.memory.textures++)}if(L.samples>0&&Y(L)===!1){H.__webglMultisampledFramebuffer=r.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ht=0;ht<Q.length;ht++){let _t=Q[ht];H.__webglColorRenderbuffer[ht]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,H.__webglColorRenderbuffer[ht]);let Wt=s.convert(_t.format,_t.colorSpace),nt=s.convert(_t.type),vt=_(_t.internalFormat,Wt,nt,_t.colorSpace,L.isXRRenderTarget===!0),te=pt(L);r.renderbufferStorageMultisample(r.RENDERBUFFER,te,vt,L.width,L.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+ht,r.RENDERBUFFER,H.__webglColorRenderbuffer[ht])}r.bindRenderbuffer(r.RENDERBUFFER,null),L.depthBuffer&&(H.__webglDepthRenderbuffer=r.createRenderbuffer(),bt(H.__webglDepthRenderbuffer,L,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(K){e.bindTexture(r.TEXTURE_CUBE_MAP,j.__webglTexture),gt(r.TEXTURE_CUBE_MAP,E);for(let ht=0;ht<6;ht++)if(E.mipmaps&&E.mipmaps.length>0)for(let _t=0;_t<E.mipmaps.length;_t++)et(H.__webglFramebuffer[ht][_t],L,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ht,_t);else et(H.__webglFramebuffer[ht],L,E,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0);p(E)&&m(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Et){for(let ht=0,_t=Q.length;ht<_t;ht++){let Wt=Q[ht],nt=n.get(Wt);e.bindTexture(r.TEXTURE_2D,nt.__webglTexture),gt(r.TEXTURE_2D,Wt),et(H.__webglFramebuffer,L,Wt,r.COLOR_ATTACHMENT0+ht,r.TEXTURE_2D,0),p(Wt)&&m(r.TEXTURE_2D)}e.unbindTexture()}else{let ht=r.TEXTURE_2D;if((L.isWebGL3DRenderTarget||L.isWebGLArrayRenderTarget)&&(ht=L.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(ht,j.__webglTexture),gt(ht,E),E.mipmaps&&E.mipmaps.length>0)for(let _t=0;_t<E.mipmaps.length;_t++)et(H.__webglFramebuffer[_t],L,E,r.COLOR_ATTACHMENT0,ht,_t);else et(H.__webglFramebuffer,L,E,r.COLOR_ATTACHMENT0,ht,0);p(E)&&m(ht),e.unbindTexture()}L.depthBuffer&&Ot(L)}function ie(L){let E=L.textures;for(let H=0,j=E.length;H<j;H++){let Q=E[H];if(p(Q)){let K=L.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:r.TEXTURE_2D,Et=n.get(Q).__webglTexture;e.bindTexture(K,Et),m(K),e.unbindTexture()}}}let P=[],it=[];function tt(L){if(L.samples>0){if(Y(L)===!1){let E=L.textures,H=L.width,j=L.height,Q=r.COLOR_BUFFER_BIT,K=L.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,Et=n.get(L),ht=E.length>1;if(ht)for(let _t=0;_t<E.length;_t++)e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+_t,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+_t,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,Et.__webglMultisampledFramebuffer),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Et.__webglFramebuffer);for(let _t=0;_t<E.length;_t++){if(L.resolveDepthBuffer&&(L.depthBuffer&&(Q|=r.DEPTH_BUFFER_BIT),L.stencilBuffer&&L.resolveStencilBuffer&&(Q|=r.STENCIL_BUFFER_BIT)),ht){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,Et.__webglColorRenderbuffer[_t]);let Wt=n.get(E[_t]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Wt,0)}r.blitFramebuffer(0,0,H,j,0,0,H,j,Q,r.NEAREST),c===!0&&(P.length=0,it.length=0,P.push(r.COLOR_ATTACHMENT0+_t),L.depthBuffer&&L.resolveDepthBuffer===!1&&(P.push(K),it.push(K),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,it)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,P))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),ht)for(let _t=0;_t<E.length;_t++){e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+_t,r.RENDERBUFFER,Et.__webglColorRenderbuffer[_t]);let Wt=n.get(E[_t]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,Et.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+_t,r.TEXTURE_2D,Wt,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,Et.__webglMultisampledFramebuffer)}else if(L.depthBuffer&&L.resolveDepthBuffer===!1&&c){let E=L.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[E])}}}function pt(L){return Math.min(i.maxSamples,L.samples)}function Y(L){let E=n.get(L);return L.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ct(L){let E=o.render.frame;h.get(L)!==E&&(h.set(L,E),L.update())}function mt(L,E){let H=L.colorSpace,j=L.format,Q=L.type;return L.isCompressedTexture===!0||L.isVideoTexture===!0||H!==Wn&&H!==li&&(se.getTransfer(H)===pe?(j!==Lt||Q!==cn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function Mt(L){return typeof HTMLImageElement<"u"&&L instanceof HTMLImageElement?(l.width=L.naturalWidth||L.width,l.height=L.naturalHeight||L.height):typeof VideoFrame<"u"&&L instanceof VideoFrame?(l.width=L.displayWidth,l.height=L.displayHeight):(l.width=L.width,l.height=L.height),l}this.allocateTextureUnit=D,this.resetTextureUnits=I,this.setTexture2D=N,this.setTexture2DArray=k,this.setTexture3D=U,this.setTextureCube=$,this.rebindTextures=$t,this.setupRenderTarget=zt,this.updateRenderTargetMipmap=ie,this.updateMultisampleRenderTarget=tt,this.setupDepthRenderbuffer=Ot,this.setupFrameBufferTexture=et,this.useMultisampledRTT=Y}function C0(r,t){function e(n,i=li){let s,o=se.getTransfer(i);if(n===cn)return r.UNSIGNED_BYTE;if(n===su)return r.UNSIGNED_SHORT_4_4_4_4;if(n===ou)return r.UNSIGNED_SHORT_5_5_5_1;if(n===Ld)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===As)return r.BYTE;if(n===da)return r.SHORT;if(n===Ii)return r.UNSIGNED_SHORT;if(n===Oi)return r.INT;if(n===nn)return r.UNSIGNED_INT;if(n===Dt)return r.FLOAT;if(n===me)return r.HALF_FLOAT;if(n===Fd)return r.ALPHA;if(n===Nd)return r.RGB;if(n===Lt)return r.RGBA;if(n===Ud)return r.LUMINANCE;if(n===Bd)return r.LUMINANCE_ALPHA;if(n===dr)return r.DEPTH_COMPONENT;if(n===gr)return r.DEPTH_STENCIL;if(n===Gn)return r.RED;if(n===Cr)return r.RED_INTEGER;if(n===Ir)return r.RG;if(n===zi)return r.RG_INTEGER;if(n===ki)return r.RGBA_INTEGER;if(n===go||n===xo||n===vo||n===_o)if(o===pe)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===go)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===xo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===vo)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===_o)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===go)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===xo)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===vo)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===_o)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===wc||n===Ac||n===Ec||n===Rc)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===wc)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Ac)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ec)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Rc)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Cc||n===Ic||n===Pc)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===Cc||n===Ic)return o===pe?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===Pc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Dc||n===Lc||n===Fc||n===Nc||n===Uc||n===Bc||n===Oc||n===zc||n===kc||n===Vc||n===Hc||n===Gc||n===Wc||n===Xc)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===Dc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Lc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Fc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Nc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Uc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Bc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Oc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===zc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===kc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Vc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Hc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Gc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Wc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Xc)return o===pe?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===yo||n===qc||n===Yc)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===yo)return o===pe?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===qc)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Yc)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Od||n===$c||n===Zc||n===Jc)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===yo)return s.COMPRESSED_RED_RGTC1_EXT;if(n===$c)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Zc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Jc)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===mr?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:e}}var nl=class extends _e{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Ri=class extends oe{constructor(){super(),this.isGroup=!0,this.type="Group"}},yT={type:"move"},Mo=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ri,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ri,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ri,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,o=null,a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(let x of t.hand.values()){let p=e.getJointPose(x,n),m=this._getHandJoint(l,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let h=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,g=.005;l.inputState.pinching&&u>d+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&u<=d-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(yT)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ri;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},bT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,MT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,If=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){let i=new Be,s=t.properties.get(i);s.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new Pe({vertexShader:bT,fragmentShader:MT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Zt(new ms(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Pf=class extends Vn{constructor(t,e){super();let n=this,i=null,s=1,o=null,a="local-floor",c=1,l=null,h=null,f=null,u=null,d=null,g=null,x=new If,p=e.getContextAttributes(),m=null,_=null,v=[],y=[],w=new X,S=null,T=new _e;T.layers.enable(1),T.viewport=new Kt;let A=new _e;A.layers.enable(2),A.viewport=new Kt;let M=[T,A],b=new nl;b.layers.enable(1),b.layers.enable(2);let I=null,D=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(q){let et=v[q];return et===void 0&&(et=new Mo,v[q]=et),et.getTargetRaySpace()},this.getControllerGrip=function(q){let et=v[q];return et===void 0&&(et=new Mo,v[q]=et),et.getGripSpace()},this.getHand=function(q){let et=v[q];return et===void 0&&(et=new Mo,v[q]=et),et.getHandSpace()};function F(q){let et=y.indexOf(q.inputSource);if(et===-1)return;let bt=v[et];bt!==void 0&&(bt.update(q.inputSource,q.frame,l||o),bt.dispatchEvent({type:q.type,data:q.inputSource}))}function N(){i.removeEventListener("select",F),i.removeEventListener("selectstart",F),i.removeEventListener("selectend",F),i.removeEventListener("squeeze",F),i.removeEventListener("squeezestart",F),i.removeEventListener("squeezeend",F),i.removeEventListener("end",N),i.removeEventListener("inputsourceschange",k);for(let q=0;q<v.length;q++){let et=y[q];et!==null&&(y[q]=null,v[q].disconnect(et))}I=null,D=null,x.reset(),t.setRenderTarget(m),d=null,u=null,f=null,i=null,_=null,qt.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(w.width,w.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(q){s=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(q){a=q,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(q){l=q},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(q){if(i=q,i!==null){if(m=t.getRenderTarget(),i.addEventListener("select",F),i.addEventListener("selectstart",F),i.addEventListener("selectend",F),i.addEventListener("squeeze",F),i.addEventListener("squeezestart",F),i.addEventListener("squeezeend",F),i.addEventListener("end",N),i.addEventListener("inputsourceschange",k),p.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(w),i.renderState.layers===void 0){let et={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(i,e,et),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),_=new be(d.framebufferWidth,d.framebufferHeight,{format:Lt,type:cn,colorSpace:t.outputColorSpace,stencilBuffer:p.stencil})}else{let et=null,bt=null,ft=null;p.depth&&(ft=p.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,et=p.stencil?gr:dr,bt=p.stencil?mr:nn);let Ot={colorFormat:e.RGBA8,depthFormat:ft,scaleFactor:s};f=new XRWebGLBinding(i,e),u=f.createProjectionLayer(Ot),i.updateRenderState({layers:[u]}),t.setPixelRatio(1),t.setSize(u.textureWidth,u.textureHeight,!1),_=new be(u.textureWidth,u.textureHeight,{format:Lt,type:cn,depthTexture:new Vo(u.textureWidth,u.textureHeight,bt,void 0,void 0,void 0,void 0,void 0,void 0,et),stencilBuffer:p.stencil,colorSpace:t.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),qt.setContext(i),qt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function k(q){for(let et=0;et<q.removed.length;et++){let bt=q.removed[et],ft=y.indexOf(bt);ft>=0&&(y[ft]=null,v[ft].disconnect(bt))}for(let et=0;et<q.added.length;et++){let bt=q.added[et],ft=y.indexOf(bt);if(ft===-1){for(let $t=0;$t<v.length;$t++)if($t>=y.length){y.push(bt),ft=$t;break}else if(y[$t]===null){y[$t]=bt,ft=$t;break}if(ft===-1)break}let Ot=v[ft];Ot&&Ot.connect(bt)}}let U=new R,$=new R;function W(q,et,bt){U.setFromMatrixPosition(et.matrixWorld),$.setFromMatrixPosition(bt.matrixWorld);let ft=U.distanceTo($),Ot=et.projectionMatrix.elements,$t=bt.projectionMatrix.elements,zt=Ot[14]/(Ot[10]-1),ie=Ot[14]/(Ot[10]+1),P=(Ot[9]+1)/Ot[5],it=(Ot[9]-1)/Ot[5],tt=(Ot[8]-1)/Ot[0],pt=($t[8]+1)/$t[0],Y=zt*tt,Ct=zt*pt,mt=ft/(-tt+pt),Mt=mt*-tt;et.matrixWorld.decompose(q.position,q.quaternion,q.scale),q.translateX(Mt),q.translateZ(mt),q.matrixWorld.compose(q.position,q.quaternion,q.scale),q.matrixWorldInverse.copy(q.matrixWorld).invert();let L=zt+mt,E=ie+mt,H=Y-Mt,j=Ct+(ft-Mt),Q=P*ie/E*L,K=it*ie/E*L;q.projectionMatrix.makePerspective(H,j,Q,K,L,E),q.projectionMatrixInverse.copy(q.projectionMatrix).invert()}function st(q,et){et===null?q.matrixWorld.copy(q.matrix):q.matrixWorld.multiplyMatrices(et.matrixWorld,q.matrix),q.matrixWorldInverse.copy(q.matrixWorld).invert()}this.updateCamera=function(q){if(i===null)return;x.texture!==null&&(q.near=x.depthNear,q.far=x.depthFar),b.near=A.near=T.near=q.near,b.far=A.far=T.far=q.far,(I!==b.near||D!==b.far)&&(i.updateRenderState({depthNear:b.near,depthFar:b.far}),I=b.near,D=b.far,T.near=I,T.far=D,A.near=I,A.far=D,T.updateProjectionMatrix(),A.updateProjectionMatrix(),q.updateProjectionMatrix());let et=q.parent,bt=b.cameras;st(b,et);for(let ft=0;ft<bt.length;ft++)st(bt[ft],et);bt.length===2?W(b,T,A):b.projectionMatrix.copy(T.projectionMatrix),lt(q,b,et)};function lt(q,et,bt){bt===null?q.matrix.copy(et.matrixWorld):(q.matrix.copy(bt.matrixWorld),q.matrix.invert(),q.matrix.multiply(et.matrixWorld)),q.matrix.decompose(q.position,q.quaternion,q.scale),q.updateMatrixWorld(!0),q.projectionMatrix.copy(et.projectionMatrix),q.projectionMatrixInverse.copy(et.projectionMatrixInverse),q.isPerspectiveCamera&&(q.fov=fs*2*Math.atan(1/q.projectionMatrix.elements[5]),q.zoom=1)}this.getCamera=function(){return b},this.getFoveation=function(){if(!(u===null&&d===null))return c},this.setFoveation=function(q){c=q,u!==null&&(u.fixedFoveation=q),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=q)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(b)};let gt=null;function Pt(q,et){if(h=et.getViewerPose(l||o),g=et,h!==null){let bt=h.views;d!==null&&(t.setRenderTargetFramebuffer(_,d.framebuffer),t.setRenderTarget(_));let ft=!1;bt.length!==b.cameras.length&&(b.cameras.length=0,ft=!0);for(let $t=0;$t<bt.length;$t++){let zt=bt[$t],ie=null;if(d!==null)ie=d.getViewport(zt);else{let it=f.getViewSubImage(u,zt);ie=it.viewport,$t===0&&(t.setRenderTargetTextures(_,it.colorTexture,u.ignoreDepthValues?void 0:it.depthStencilTexture),t.setRenderTarget(_))}let P=M[$t];P===void 0&&(P=new _e,P.layers.enable($t),P.viewport=new Kt,M[$t]=P),P.matrix.fromArray(zt.transform.matrix),P.matrix.decompose(P.position,P.quaternion,P.scale),P.projectionMatrix.fromArray(zt.projectionMatrix),P.projectionMatrixInverse.copy(P.projectionMatrix).invert(),P.viewport.set(ie.x,ie.y,ie.width,ie.height),$t===0&&(b.matrix.copy(P.matrix),b.matrix.decompose(b.position,b.quaternion,b.scale)),ft===!0&&b.cameras.push(P)}let Ot=i.enabledFeatures;if(Ot&&Ot.includes("depth-sensing")){let $t=f.getDepthInformation(bt[0]);$t&&$t.isValid&&$t.texture&&x.init(t,$t,i.renderState)}}for(let bt=0;bt<v.length;bt++){let ft=y[bt],Ot=v[bt];ft!==null&&Ot!==void 0&&Ot.update(ft,et,l||o)}gt&&gt(q,et),et.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:et}),g=null}let qt=new T0;qt.setAnimationLoop(Pt),this.setAnimationLoop=function(q){gt=q},this.dispose=function(){}}},tr=new Sn,ST=new dt;function TT(r,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,M0(r)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,_,v,y){m.isMeshBasicMaterial||m.isMeshLambertMaterial?s(p,m):m.isMeshToonMaterial?(s(p,m),f(p,m)):m.isMeshPhongMaterial?(s(p,m),h(p,m)):m.isMeshStandardMaterial?(s(p,m),u(p,m),m.isMeshPhysicalMaterial&&d(p,m,y)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),x(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?c(p,m,_,v):m.isSpriteMaterial?l(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Ie&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Ie&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let _=t.get(m),v=_.envMap,y=_.envMapRotation;v&&(p.envMap.value=v,tr.copy(y),tr.x*=-1,tr.y*=-1,tr.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(tr.y*=-1,tr.z*=-1),p.envMapRotation.value.setFromMatrix4(ST.makeRotationFromEuler(tr)),p.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function c(p,m,_,v){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*_,p.scale.value=v*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function l(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function f(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function u(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,_){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ie&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=_.texture,p.transmissionSamplerSize.value.set(_.width,_.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){let _=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(_.matrixWorld),p.nearDistance.value=_.shadow.camera.near,p.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function wT(r,t,e,n){let i={},s={},o=[],a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,v){let y=v.program;n.uniformBlockBinding(_,y)}function l(_,v){let y=i[_.id];y===void 0&&(g(_),y=h(_),i[_.id]=y,_.addEventListener("dispose",p));let w=v.program;n.updateUBOMapping(_,w);let S=t.render.frame;s[_.id]!==S&&(u(_),s[_.id]=S)}function h(_){let v=f();_.__bindingPointIndex=v;let y=r.createBuffer(),w=_.__size,S=_.usage;return r.bindBuffer(r.UNIFORM_BUFFER,y),r.bufferData(r.UNIFORM_BUFFER,w,S),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,v,y),y}function f(){for(let _=0;_<a;_++)if(o.indexOf(_)===-1)return o.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(_){let v=i[_.id],y=_.uniforms,w=_.__cache;r.bindBuffer(r.UNIFORM_BUFFER,v);for(let S=0,T=y.length;S<T;S++){let A=Array.isArray(y[S])?y[S]:[y[S]];for(let M=0,b=A.length;M<b;M++){let I=A[M];if(d(I,S,M,w)===!0){let D=I.__offset,F=Array.isArray(I.value)?I.value:[I.value],N=0;for(let k=0;k<F.length;k++){let U=F[k],$=x(U);typeof U=="number"||typeof U=="boolean"?(I.__data[0]=U,r.bufferSubData(r.UNIFORM_BUFFER,D+N,I.__data)):U.isMatrix3?(I.__data[0]=U.elements[0],I.__data[1]=U.elements[1],I.__data[2]=U.elements[2],I.__data[3]=0,I.__data[4]=U.elements[3],I.__data[5]=U.elements[4],I.__data[6]=U.elements[5],I.__data[7]=0,I.__data[8]=U.elements[6],I.__data[9]=U.elements[7],I.__data[10]=U.elements[8],I.__data[11]=0):(U.toArray(I.__data,N),N+=$.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,D,I.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function d(_,v,y,w){let S=_.value,T=v+"_"+y;if(w[T]===void 0)return typeof S=="number"||typeof S=="boolean"?w[T]=S:w[T]=S.clone(),!0;{let A=w[T];if(typeof S=="number"||typeof S=="boolean"){if(A!==S)return w[T]=S,!0}else if(A.equals(S)===!1)return A.copy(S),!0}return!1}function g(_){let v=_.uniforms,y=0,w=16;for(let T=0,A=v.length;T<A;T++){let M=Array.isArray(v[T])?v[T]:[v[T]];for(let b=0,I=M.length;b<I;b++){let D=M[b],F=Array.isArray(D.value)?D.value:[D.value];for(let N=0,k=F.length;N<k;N++){let U=F[N],$=x(U),W=y%w;W!==0&&w-W<$.boundary&&(y+=w-W),D.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),D.__offset=y,y+=$.storage}}}let S=y%w;return S>0&&(y+=w-S),_.__size=y,_.__cache={},this}function x(_){let v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function p(_){let v=_.target;v.removeEventListener("dispose",p);let y=o.indexOf(v.__bindingPointIndex);o.splice(y,1),r.deleteBuffer(i[v.id]),delete i[v.id],delete s[v.id]}function m(){for(let _ in i)r.deleteBuffer(i[_]);o=[],i={},s={}}return{bind:c,update:l,dispose:m}}var Df=class{constructor(t={}){let{canvas:e=y0(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=o;let d=new Uint32Array(4),g=new Int32Array(4),x=null,p=null,m=[],_=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Rn,this.toneMapping=zn,this.toneMappingExposure=1;let v=this,y=!1,w=0,S=0,T=null,A=-1,M=null,b=new Kt,I=new Kt,D=null,F=new at(0),N=0,k=e.width,U=e.height,$=1,W=null,st=null,lt=new Kt(0,0,k,U),gt=new Kt(0,0,k,U),Pt=!1,qt=new vr,q=!1,et=!1,bt=new dt,ft=new R,Ot=new Kt,$t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},zt=!1;function ie(){return T===null?$:1}let P=n;function it(C,O){return e.getContext(C,O)}try{let C={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Ts}`),e.addEventListener("webglcontextlost",Z,!1),e.addEventListener("webglcontextrestored",J,!1),e.addEventListener("webglcontextcreationerror",ct,!1),P===null){let O="webgl2";if(P=it(O,C),P===null)throw it(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(C){throw console.error("THREE.WebGLRenderer: "+C.message),C}let tt,pt,Y,Ct,mt,Mt,L,E,H,j,Q,K,Et,ht,_t,Wt,nt,vt,te,Vt,St,Gt,Jt,ve;function B(){tt=new kM(P),tt.init(),Gt=new C0(P,tt),pt=new FM(P,tt,t,Gt),Y=new dT(P),Ct=new GM(P),mt=new eT,Mt=new _T(P,tt,Y,mt,pt,Gt,Ct),L=new UM(v),E=new zM(v),H=new J_(P),Jt=new DM(P,H),j=new VM(P,H,Ct,Jt),Q=new XM(P,j,H,Ct),te=new WM(P,pt,Mt),Wt=new NM(mt),K=new tT(v,L,E,tt,pt,Jt,Wt),Et=new TT(v,mt),ht=new iT,_t=new lT(tt),vt=new PM(v,L,E,Y,Q,u,c),nt=new fT(v,Q,pt),ve=new wT(P,Ct,pt,Y),Vt=new LM(P,tt,Ct),St=new HM(P,tt,Ct),Ct.programs=K.programs,v.capabilities=pt,v.extensions=tt,v.properties=mt,v.renderLists=ht,v.shadowMap=nt,v.state=Y,v.info=Ct}B();let rt=new Pf(v,P);this.xr=rt,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){let C=tt.get("WEBGL_lose_context");C&&C.loseContext()},this.forceContextRestore=function(){let C=tt.get("WEBGL_lose_context");C&&C.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(C){C!==void 0&&($=C,this.setSize(k,U,!1))},this.getSize=function(C){return C.set(k,U)},this.setSize=function(C,O,V=!0){if(rt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}k=C,U=O,e.width=Math.floor(C*$),e.height=Math.floor(O*$),V===!0&&(e.style.width=C+"px",e.style.height=O+"px"),this.setViewport(0,0,C,O)},this.getDrawingBufferSize=function(C){return C.set(k*$,U*$).floor()},this.setDrawingBufferSize=function(C,O,V){k=C,U=O,$=V,e.width=Math.floor(C*V),e.height=Math.floor(O*V),this.setViewport(0,0,C,O)},this.getCurrentViewport=function(C){return C.copy(b)},this.getViewport=function(C){return C.copy(lt)},this.setViewport=function(C,O,V,G){C.isVector4?lt.set(C.x,C.y,C.z,C.w):lt.set(C,O,V,G),Y.viewport(b.copy(lt).multiplyScalar($).round())},this.getScissor=function(C){return C.copy(gt)},this.setScissor=function(C,O,V,G){C.isVector4?gt.set(C.x,C.y,C.z,C.w):gt.set(C,O,V,G),Y.scissor(I.copy(gt).multiplyScalar($).round())},this.getScissorTest=function(){return Pt},this.setScissorTest=function(C){Y.setScissorTest(Pt=C)},this.setOpaqueSort=function(C){W=C},this.setTransparentSort=function(C){st=C},this.getClearColor=function(C){return C.copy(vt.getClearColor())},this.setClearColor=function(){vt.setClearColor.apply(vt,arguments)},this.getClearAlpha=function(){return vt.getClearAlpha()},this.setClearAlpha=function(){vt.setClearAlpha.apply(vt,arguments)},this.clear=function(C=!0,O=!0,V=!0){let G=0;if(C){let z=!1;if(T!==null){let ot=T.texture.format;z=ot===ki||ot===zi||ot===Cr}if(z){let ot=T.texture.type,xt=ot===cn||ot===nn||ot===Ii||ot===mr||ot===su||ot===ou,Tt=vt.getClearColor(),wt=vt.getClearAlpha(),Bt=Tt.r,kt=Tt.g,It=Tt.b;xt?(d[0]=Bt,d[1]=kt,d[2]=It,d[3]=wt,P.clearBufferuiv(P.COLOR,0,d)):(g[0]=Bt,g[1]=kt,g[2]=It,g[3]=wt,P.clearBufferiv(P.COLOR,0,g))}else G|=P.COLOR_BUFFER_BIT}O&&(G|=P.DEPTH_BUFFER_BIT),V&&(G|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),P.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",Z,!1),e.removeEventListener("webglcontextrestored",J,!1),e.removeEventListener("webglcontextcreationerror",ct,!1),ht.dispose(),_t.dispose(),mt.dispose(),L.dispose(),E.dispose(),Q.dispose(),Jt.dispose(),ve.dispose(),K.dispose(),rt.dispose(),rt.removeEventListener("sessionstart",Yn),rt.removeEventListener("sessionend",Np),$i.stop()};function Z(C){C.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function J(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;let C=Ct.autoReset,O=nt.enabled,V=nt.autoUpdate,G=nt.needsUpdate,z=nt.type;B(),Ct.autoReset=C,nt.enabled=O,nt.autoUpdate=V,nt.needsUpdate=G,nt.type=z}function ct(C){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",C.statusMessage)}function Ut(C){let O=C.target;O.removeEventListener("dispose",Ut),ee(O)}function ee(C){De(C),mt.remove(C)}function De(C){let O=mt.get(C).programs;O!==void 0&&(O.forEach(function(V){K.releaseProgram(V)}),C.isShaderMaterial&&K.releaseShaderCache(C))}this.renderBufferDirect=function(C,O,V,G,z,ot){O===null&&(O=$t);let xt=z.isMesh&&z.matrixWorld.determinant()<0,Tt=Ev(C,O,V,G,z);Y.setMaterial(G,xt);let wt=V.index,Bt=1;if(G.wireframe===!0){if(wt=j.getWireframeAttribute(V),wt===void 0)return;Bt=2}let kt=V.drawRange,It=V.attributes.position,ce=kt.start*Bt,Se=(kt.start+kt.count)*Bt;ot!==null&&(ce=Math.max(ce,ot.start*Bt),Se=Math.min(Se,(ot.start+ot.count)*Bt)),wt!==null?(ce=Math.max(ce,0),Se=Math.min(Se,wt.count)):It!=null&&(ce=Math.max(ce,0),Se=Math.min(Se,It.count));let Te=Se-ce;if(Te<0||Te===1/0)return;Jt.setup(z,G,Tt,V,wt);let vn,le=Vt;if(wt!==null&&(vn=H.get(wt),le=St,le.setIndex(vn)),z.isMesh)G.wireframe===!0?(Y.setLineWidth(G.wireframeLinewidth*ie()),le.setMode(P.LINES)):le.setMode(P.TRIANGLES);else if(z.isLine){let At=G.linewidth;At===void 0&&(At=1),Y.setLineWidth(At*ie()),z.isLineSegments?le.setMode(P.LINES):z.isLineLoop?le.setMode(P.LINE_LOOP):le.setMode(P.LINE_STRIP)}else z.isPoints?le.setMode(P.POINTS):z.isSprite&&le.setMode(P.TRIANGLES);if(z.isBatchedMesh)if(z._multiDrawInstances!==null)le.renderMultiDrawInstances(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount,z._multiDrawInstances);else if(tt.get("WEBGL_multi_draw"))le.renderMultiDraw(z._multiDrawStarts,z._multiDrawCounts,z._multiDrawCount);else{let At=z._multiDrawStarts,Ye=z._multiDrawCounts,ue=z._multiDrawCount,Dn=wt?H.get(wt).bytesPerElement:1,Or=mt.get(G).currentProgram.getUniforms();for(let _n=0;_n<ue;_n++)Or.setValue(P,"_gl_DrawID",_n),le.render(At[_n]/Dn,Ye[_n])}else if(z.isInstancedMesh)le.renderInstances(ce,Te,z.count);else if(V.isInstancedBufferGeometry){let At=V._maxInstanceCount!==void 0?V._maxInstanceCount:1/0,Ye=Math.min(V.instanceCount,At);le.renderInstances(ce,Te,Ye)}else le.render(ce,Te)};function qe(C,O,V){C.transparent===!0&&C.side===dn&&C.forceSinglePass===!1?(C.side=Ie,C.needsUpdate=!0,Ca(C,O,V),C.side=pn,C.needsUpdate=!0,Ca(C,O,V),C.side=dn):Ca(C,O,V)}this.compile=function(C,O,V=null){V===null&&(V=C),p=_t.get(V),p.init(O),_.push(p),V.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),C!==V&&C.traverseVisible(function(z){z.isLight&&z.layers.test(O.layers)&&(p.pushLight(z),z.castShadow&&p.pushShadow(z))}),p.setupLights();let G=new Set;return C.traverse(function(z){let ot=z.material;if(ot)if(Array.isArray(ot))for(let xt=0;xt<ot.length;xt++){let Tt=ot[xt];qe(Tt,V,z),G.add(Tt)}else qe(ot,V,z),G.add(ot)}),_.pop(),p=null,G},this.compileAsync=function(C,O,V=null){let G=this.compile(C,O,V);return new Promise(z=>{function ot(){if(G.forEach(function(xt){mt.get(xt).currentProgram.isReady()&&G.delete(xt)}),G.size===0){z(C);return}setTimeout(ot,10)}tt.get("KHR_parallel_shader_compile")!==null?ot():setTimeout(ot,10)})};let ae=null;function ni(C){ae&&ae(C)}function Yn(){$i.stop()}function Np(){$i.start()}let $i=new T0;$i.setAnimationLoop(ni),typeof self<"u"&&$i.setContext(self),this.setAnimationLoop=function(C){ae=C,rt.setAnimationLoop(C),C===null?$i.stop():$i.start()},rt.addEventListener("sessionstart",Yn),rt.addEventListener("sessionend",Np),this.render=function(C,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(C.matrixWorldAutoUpdate===!0&&C.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),rt.enabled===!0&&rt.isPresenting===!0&&(rt.cameraAutoUpdate===!0&&rt.updateCamera(O),O=rt.getCamera()),C.isScene===!0&&C.onBeforeRender(v,C,O,T),p=_t.get(C,_.length),p.init(O),_.push(p),bt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),qt.setFromProjectionMatrix(bt),et=this.localClippingEnabled,q=Wt.init(this.clippingPlanes,et),x=ht.get(C,m.length),x.init(),m.push(x),rt.enabled===!0&&rt.isPresenting===!0){let ot=v.xr.getDepthSensingMesh();ot!==null&&yh(ot,O,-1/0,v.sortObjects)}yh(C,O,0,v.sortObjects),x.finish(),v.sortObjects===!0&&x.sort(W,st),zt=rt.enabled===!1||rt.isPresenting===!1||rt.hasDepthSensing()===!1,zt&&vt.addToRenderList(x,C),this.info.render.frame++,q===!0&&Wt.beginShadows();let V=p.state.shadowsArray;nt.render(V,C,O),q===!0&&Wt.endShadows(),this.info.autoReset===!0&&this.info.reset();let G=x.opaque,z=x.transmissive;if(p.setupLights(),O.isArrayCamera){let ot=O.cameras;if(z.length>0)for(let xt=0,Tt=ot.length;xt<Tt;xt++){let wt=ot[xt];Bp(G,z,C,wt)}zt&&vt.render(C);for(let xt=0,Tt=ot.length;xt<Tt;xt++){let wt=ot[xt];Up(x,C,wt,wt.viewport)}}else z.length>0&&Bp(G,z,C,O),zt&&vt.render(C),Up(x,C,O);T!==null&&(Mt.updateMultisampleRenderTarget(T),Mt.updateRenderTargetMipmap(T)),C.isScene===!0&&C.onAfterRender(v,C,O),Jt.resetDefaultState(),A=-1,M=null,_.pop(),_.length>0?(p=_[_.length-1],q===!0&&Wt.setGlobalState(v.clippingPlanes,p.state.camera)):p=null,m.pop(),m.length>0?x=m[m.length-1]:x=null};function yh(C,O,V,G){if(C.visible===!1)return;if(C.layers.test(O.layers)){if(C.isGroup)V=C.renderOrder;else if(C.isLOD)C.autoUpdate===!0&&C.update(O);else if(C.isLight)p.pushLight(C),C.castShadow&&p.pushShadow(C);else if(C.isSprite){if(!C.frustumCulled||qt.intersectsSprite(C)){G&&Ot.setFromMatrixPosition(C.matrixWorld).applyMatrix4(bt);let xt=Q.update(C),Tt=C.material;Tt.visible&&x.push(C,xt,Tt,V,Ot.z,null)}}else if((C.isMesh||C.isLine||C.isPoints)&&(!C.frustumCulled||qt.intersectsObject(C))){let xt=Q.update(C),Tt=C.material;if(G&&(C.boundingSphere!==void 0?(C.boundingSphere===null&&C.computeBoundingSphere(),Ot.copy(C.boundingSphere.center)):(xt.boundingSphere===null&&xt.computeBoundingSphere(),Ot.copy(xt.boundingSphere.center)),Ot.applyMatrix4(C.matrixWorld).applyMatrix4(bt)),Array.isArray(Tt)){let wt=xt.groups;for(let Bt=0,kt=wt.length;Bt<kt;Bt++){let It=wt[Bt],ce=Tt[It.materialIndex];ce&&ce.visible&&x.push(C,xt,ce,V,Ot.z,It)}}else Tt.visible&&x.push(C,xt,Tt,V,Ot.z,null)}}let ot=C.children;for(let xt=0,Tt=ot.length;xt<Tt;xt++)yh(ot[xt],O,V,G)}function Up(C,O,V,G){let z=C.opaque,ot=C.transmissive,xt=C.transparent;p.setupLightsView(V),q===!0&&Wt.setGlobalState(v.clippingPlanes,V),G&&Y.viewport(b.copy(G)),z.length>0&&Ra(z,O,V),ot.length>0&&Ra(ot,O,V),xt.length>0&&Ra(xt,O,V),Y.buffers.depth.setTest(!0),Y.buffers.depth.setMask(!0),Y.buffers.color.setMask(!0),Y.setPolygonOffset(!1)}function Bp(C,O,V,G){if((V.isScene===!0?V.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[G.id]===void 0&&(p.state.transmissionRenderTarget[G.id]=new be(1,1,{generateMipmaps:!0,type:tt.has("EXT_color_buffer_half_float")||tt.has("EXT_color_buffer_float")?me:cn,minFilter:Zn,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:se.workingColorSpace}));let ot=p.state.transmissionRenderTarget[G.id],xt=G.viewport||b;ot.setSize(xt.z,xt.w);let Tt=v.getRenderTarget();v.setRenderTarget(ot),v.getClearColor(F),N=v.getClearAlpha(),N<1&&v.setClearColor(16777215,.5),zt?vt.render(V):v.clear();let wt=v.toneMapping;v.toneMapping=zn;let Bt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),p.setupLightsView(G),q===!0&&Wt.setGlobalState(v.clippingPlanes,G),Ra(C,V,G),Mt.updateMultisampleRenderTarget(ot),Mt.updateRenderTargetMipmap(ot),tt.has("WEBGL_multisampled_render_to_texture")===!1){let kt=!1;for(let It=0,ce=O.length;It<ce;It++){let Se=O[It],Te=Se.object,vn=Se.geometry,le=Se.material,At=Se.group;if(le.side===dn&&Te.layers.test(G.layers)){let Ye=le.side;le.side=Ie,le.needsUpdate=!0,Op(Te,V,G,vn,le,At),le.side=Ye,le.needsUpdate=!0,kt=!0}}kt===!0&&(Mt.updateMultisampleRenderTarget(ot),Mt.updateRenderTargetMipmap(ot))}v.setRenderTarget(Tt),v.setClearColor(F,N),Bt!==void 0&&(G.viewport=Bt),v.toneMapping=wt}function Ra(C,O,V){let G=O.isScene===!0?O.overrideMaterial:null;for(let z=0,ot=C.length;z<ot;z++){let xt=C[z],Tt=xt.object,wt=xt.geometry,Bt=G===null?xt.material:G,kt=xt.group;Tt.layers.test(V.layers)&&Op(Tt,O,V,wt,Bt,kt)}}function Op(C,O,V,G,z,ot){C.onBeforeRender(v,O,V,G,z,ot),C.modelViewMatrix.multiplyMatrices(V.matrixWorldInverse,C.matrixWorld),C.normalMatrix.getNormalMatrix(C.modelViewMatrix),z.transparent===!0&&z.side===dn&&z.forceSinglePass===!1?(z.side=Ie,z.needsUpdate=!0,v.renderBufferDirect(V,O,G,z,C,ot),z.side=pn,z.needsUpdate=!0,v.renderBufferDirect(V,O,G,z,C,ot),z.side=dn):v.renderBufferDirect(V,O,G,z,C,ot),C.onAfterRender(v,O,V,G,z,ot)}function Ca(C,O,V){O.isScene!==!0&&(O=$t);let G=mt.get(C),z=p.state.lights,ot=p.state.shadowsArray,xt=z.state.version,Tt=K.getParameters(C,z.state,ot,O,V),wt=K.getProgramCacheKey(Tt),Bt=G.programs;G.environment=C.isMeshStandardMaterial?O.environment:null,G.fog=O.fog,G.envMap=(C.isMeshStandardMaterial?E:L).get(C.envMap||G.environment),G.envMapRotation=G.environment!==null&&C.envMap===null?O.environmentRotation:C.envMapRotation,Bt===void 0&&(C.addEventListener("dispose",Ut),Bt=new Map,G.programs=Bt);let kt=Bt.get(wt);if(kt!==void 0){if(G.currentProgram===kt&&G.lightsStateVersion===xt)return kp(C,Tt),kt}else Tt.uniforms=K.getUniforms(C),C.onBeforeCompile(Tt,v),kt=K.acquireProgram(Tt,wt),Bt.set(wt,kt),G.uniforms=Tt.uniforms;let It=G.uniforms;return(!C.isShaderMaterial&&!C.isRawShaderMaterial||C.clipping===!0)&&(It.clippingPlanes=Wt.uniform),kp(C,Tt),G.needsLights=Cv(C),G.lightsStateVersion=xt,G.needsLights&&(It.ambientLightColor.value=z.state.ambient,It.lightProbe.value=z.state.probe,It.directionalLights.value=z.state.directional,It.directionalLightShadows.value=z.state.directionalShadow,It.spotLights.value=z.state.spot,It.spotLightShadows.value=z.state.spotShadow,It.rectAreaLights.value=z.state.rectArea,It.ltc_1.value=z.state.rectAreaLTC1,It.ltc_2.value=z.state.rectAreaLTC2,It.pointLights.value=z.state.point,It.pointLightShadows.value=z.state.pointShadow,It.hemisphereLights.value=z.state.hemi,It.directionalShadowMap.value=z.state.directionalShadowMap,It.directionalShadowMatrix.value=z.state.directionalShadowMatrix,It.spotShadowMap.value=z.state.spotShadowMap,It.spotLightMatrix.value=z.state.spotLightMatrix,It.spotLightMap.value=z.state.spotLightMap,It.pointShadowMap.value=z.state.pointShadowMap,It.pointShadowMatrix.value=z.state.pointShadowMatrix),G.currentProgram=kt,G.uniformsList=null,kt}function zp(C){if(C.uniformsList===null){let O=C.currentProgram.getUniforms();C.uniformsList=hs.seqWithValue(O.seq,C.uniforms)}return C.uniformsList}function kp(C,O){let V=mt.get(C);V.outputColorSpace=O.outputColorSpace,V.batching=O.batching,V.batchingColor=O.batchingColor,V.instancing=O.instancing,V.instancingColor=O.instancingColor,V.instancingMorph=O.instancingMorph,V.skinning=O.skinning,V.morphTargets=O.morphTargets,V.morphNormals=O.morphNormals,V.morphColors=O.morphColors,V.morphTargetsCount=O.morphTargetsCount,V.numClippingPlanes=O.numClippingPlanes,V.numIntersection=O.numClipIntersection,V.vertexAlphas=O.vertexAlphas,V.vertexTangents=O.vertexTangents,V.toneMapping=O.toneMapping}function Ev(C,O,V,G,z){O.isScene!==!0&&(O=$t),Mt.resetTextureUnits();let ot=O.fog,xt=G.isMeshStandardMaterial?O.environment:null,Tt=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Wn,wt=(G.isMeshStandardMaterial?E:L).get(G.envMap||xt),Bt=G.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,kt=!!V.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),It=!!V.morphAttributes.position,ce=!!V.morphAttributes.normal,Se=!!V.morphAttributes.color,Te=zn;G.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(Te=v.toneMapping);let vn=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,le=vn!==void 0?vn.length:0,At=mt.get(G),Ye=p.state.lights;if(q===!0&&(et===!0||C!==M)){let An=C===M&&G.id===A;Wt.setState(G,C,An)}let ue=!1;G.version===At.__version?(At.needsLights&&At.lightsStateVersion!==Ye.state.version||At.outputColorSpace!==Tt||z.isBatchedMesh&&At.batching===!1||!z.isBatchedMesh&&At.batching===!0||z.isBatchedMesh&&At.batchingColor===!0&&z.colorTexture===null||z.isBatchedMesh&&At.batchingColor===!1&&z.colorTexture!==null||z.isInstancedMesh&&At.instancing===!1||!z.isInstancedMesh&&At.instancing===!0||z.isSkinnedMesh&&At.skinning===!1||!z.isSkinnedMesh&&At.skinning===!0||z.isInstancedMesh&&At.instancingColor===!0&&z.instanceColor===null||z.isInstancedMesh&&At.instancingColor===!1&&z.instanceColor!==null||z.isInstancedMesh&&At.instancingMorph===!0&&z.morphTexture===null||z.isInstancedMesh&&At.instancingMorph===!1&&z.morphTexture!==null||At.envMap!==wt||G.fog===!0&&At.fog!==ot||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==Wt.numPlanes||At.numIntersection!==Wt.numIntersection)||At.vertexAlphas!==Bt||At.vertexTangents!==kt||At.morphTargets!==It||At.morphNormals!==ce||At.morphColors!==Se||At.toneMapping!==Te||At.morphTargetsCount!==le)&&(ue=!0):(ue=!0,At.__version=G.version);let Dn=At.currentProgram;ue===!0&&(Dn=Ca(G,O,z));let Or=!1,_n=!1,bh=!1,Le=Dn.getUniforms(),vi=At.uniforms;if(Y.useProgram(Dn.program)&&(Or=!0,_n=!0,bh=!0),G.id!==A&&(A=G.id,_n=!0),Or||M!==C){Le.setValue(P,"projectionMatrix",C.projectionMatrix),Le.setValue(P,"viewMatrix",C.matrixWorldInverse);let An=Le.map.cameraPosition;An!==void 0&&An.setValue(P,ft.setFromMatrixPosition(C.matrixWorld)),pt.logarithmicDepthBuffer&&Le.setValue(P,"logDepthBufFC",2/(Math.log(C.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Le.setValue(P,"isOrthographic",C.isOrthographicCamera===!0),M!==C&&(M=C,_n=!0,bh=!0)}if(z.isSkinnedMesh){Le.setOptional(P,z,"bindMatrix"),Le.setOptional(P,z,"bindMatrixInverse");let An=z.skeleton;An&&(An.boneTexture===null&&An.computeBoneTexture(),Le.setValue(P,"boneTexture",An.boneTexture,Mt))}z.isBatchedMesh&&(Le.setOptional(P,z,"batchingTexture"),Le.setValue(P,"batchingTexture",z._matricesTexture,Mt),Le.setOptional(P,z,"batchingIdTexture"),Le.setValue(P,"batchingIdTexture",z._indirectTexture,Mt),Le.setOptional(P,z,"batchingColorTexture"),z._colorsTexture!==null&&Le.setValue(P,"batchingColorTexture",z._colorsTexture,Mt));let Mh=V.morphAttributes;if((Mh.position!==void 0||Mh.normal!==void 0||Mh.color!==void 0)&&te.update(z,V,Dn),(_n||At.receiveShadow!==z.receiveShadow)&&(At.receiveShadow=z.receiveShadow,Le.setValue(P,"receiveShadow",z.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(vi.envMap.value=wt,vi.flipEnvMap.value=wt.isCubeTexture&&wt.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&O.environment!==null&&(vi.envMapIntensity.value=O.environmentIntensity),_n&&(Le.setValue(P,"toneMappingExposure",v.toneMappingExposure),At.needsLights&&Rv(vi,bh),ot&&G.fog===!0&&Et.refreshFogUniforms(vi,ot),Et.refreshMaterialUniforms(vi,G,$,U,p.state.transmissionRenderTarget[C.id]),hs.upload(P,zp(At),vi,Mt)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(hs.upload(P,zp(At),vi,Mt),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Le.setValue(P,"center",z.center),Le.setValue(P,"modelViewMatrix",z.modelViewMatrix),Le.setValue(P,"normalMatrix",z.normalMatrix),Le.setValue(P,"modelMatrix",z.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){let An=G.uniformsGroups;for(let Sh=0,Iv=An.length;Sh<Iv;Sh++){let Vp=An[Sh];ve.update(Vp,Dn),ve.bind(Vp,Dn)}}return Dn}function Rv(C,O){C.ambientLightColor.needsUpdate=O,C.lightProbe.needsUpdate=O,C.directionalLights.needsUpdate=O,C.directionalLightShadows.needsUpdate=O,C.pointLights.needsUpdate=O,C.pointLightShadows.needsUpdate=O,C.spotLights.needsUpdate=O,C.spotLightShadows.needsUpdate=O,C.rectAreaLights.needsUpdate=O,C.hemisphereLights.needsUpdate=O}function Cv(C){return C.isMeshLambertMaterial||C.isMeshToonMaterial||C.isMeshPhongMaterial||C.isMeshStandardMaterial||C.isShadowMaterial||C.isShaderMaterial&&C.lights===!0}this.getActiveCubeFace=function(){return w},this.getActiveMipmapLevel=function(){return S},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(C,O,V){mt.get(C.texture).__webglTexture=O,mt.get(C.depthTexture).__webglTexture=V;let G=mt.get(C);G.__hasExternalTextures=!0,G.__autoAllocateDepthBuffer=V===void 0,G.__autoAllocateDepthBuffer||tt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(C,O){let V=mt.get(C);V.__webglFramebuffer=O,V.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(C,O=0,V=0){T=C,w=O,S=V;let G=!0,z=null,ot=!1,xt=!1;if(C){let wt=mt.get(C);wt.__useDefaultFramebuffer!==void 0?(Y.bindFramebuffer(P.FRAMEBUFFER,null),G=!1):wt.__webglFramebuffer===void 0?Mt.setupRenderTarget(C):wt.__hasExternalTextures&&Mt.rebindTextures(C,mt.get(C.texture).__webglTexture,mt.get(C.depthTexture).__webglTexture);let Bt=C.texture;(Bt.isData3DTexture||Bt.isDataArrayTexture||Bt.isCompressedArrayTexture)&&(xt=!0);let kt=mt.get(C).__webglFramebuffer;C.isWebGLCubeRenderTarget?(Array.isArray(kt[O])?z=kt[O][V]:z=kt[O],ot=!0):C.samples>0&&Mt.useMultisampledRTT(C)===!1?z=mt.get(C).__webglMultisampledFramebuffer:Array.isArray(kt)?z=kt[V]:z=kt,b.copy(C.viewport),I.copy(C.scissor),D=C.scissorTest}else b.copy(lt).multiplyScalar($).floor(),I.copy(gt).multiplyScalar($).floor(),D=Pt;if(Y.bindFramebuffer(P.FRAMEBUFFER,z)&&G&&Y.drawBuffers(C,z),Y.viewport(b),Y.scissor(I),Y.setScissorTest(D),ot){let wt=mt.get(C.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+O,wt.__webglTexture,V)}else if(xt){let wt=mt.get(C.texture),Bt=O||0;P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,wt.__webglTexture,V||0,Bt)}A=-1},this.readRenderTargetPixels=function(C,O,V,G,z,ot,xt){if(!(C&&C.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Tt=mt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&xt!==void 0&&(Tt=Tt[xt]),Tt){Y.bindFramebuffer(P.FRAMEBUFFER,Tt);try{let wt=C.texture,Bt=wt.format,kt=wt.type;if(!pt.textureFormatReadable(Bt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!pt.textureTypeReadable(kt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=C.width-G&&V>=0&&V<=C.height-z&&P.readPixels(O,V,G,z,Gt.convert(Bt),Gt.convert(kt),ot)}finally{let wt=T!==null?mt.get(T).__webglFramebuffer:null;Y.bindFramebuffer(P.FRAMEBUFFER,wt)}}},this.readRenderTargetPixelsAsync=async function(C,O,V,G,z,ot,xt){if(!(C&&C.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Tt=mt.get(C).__webglFramebuffer;if(C.isWebGLCubeRenderTarget&&xt!==void 0&&(Tt=Tt[xt]),Tt){Y.bindFramebuffer(P.FRAMEBUFFER,Tt);try{let wt=C.texture,Bt=wt.format,kt=wt.type;if(!pt.textureFormatReadable(Bt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!pt.textureTypeReadable(kt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=C.width-G&&V>=0&&V<=C.height-z){let It=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,It),P.bufferData(P.PIXEL_PACK_BUFFER,ot.byteLength,P.STREAM_READ),P.readPixels(O,V,G,z,Gt.convert(Bt),Gt.convert(kt),0),P.flush();let ce=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);await I_(P,ce,4);try{P.bindBuffer(P.PIXEL_PACK_BUFFER,It),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,ot)}finally{P.deleteBuffer(It),P.deleteSync(ce)}return ot}}finally{let wt=T!==null?mt.get(T).__webglFramebuffer:null;Y.bindFramebuffer(P.FRAMEBUFFER,wt)}}},this.copyFramebufferToTexture=function(C,O=null,V=0){C.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,C=arguments[1]);let G=Math.pow(2,-V),z=Math.floor(C.image.width*G),ot=Math.floor(C.image.height*G),xt=O!==null?O.x:0,Tt=O!==null?O.y:0;Mt.setTexture2D(C,0),P.copyTexSubImage2D(P.TEXTURE_2D,V,0,0,xt,Tt,z,ot),Y.unbindTexture()},this.copyTextureToTexture=function(C,O,V=null,G=null,z=0){C.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),G=arguments[0]||null,C=arguments[1],O=arguments[2],z=arguments[3]||0,V=null);let ot,xt,Tt,wt,Bt,kt;V!==null?(ot=V.max.x-V.min.x,xt=V.max.y-V.min.y,Tt=V.min.x,wt=V.min.y):(ot=C.image.width,xt=C.image.height,Tt=0,wt=0),G!==null?(Bt=G.x,kt=G.y):(Bt=0,kt=0);let It=Gt.convert(O.format),ce=Gt.convert(O.type);Mt.setTexture2D(O,0),P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,O.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,O.unpackAlignment);let Se=P.getParameter(P.UNPACK_ROW_LENGTH),Te=P.getParameter(P.UNPACK_IMAGE_HEIGHT),vn=P.getParameter(P.UNPACK_SKIP_PIXELS),le=P.getParameter(P.UNPACK_SKIP_ROWS),At=P.getParameter(P.UNPACK_SKIP_IMAGES),Ye=C.isCompressedTexture?C.mipmaps[z]:C.image;P.pixelStorei(P.UNPACK_ROW_LENGTH,Ye.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ye.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Tt),P.pixelStorei(P.UNPACK_SKIP_ROWS,wt),C.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,z,Bt,kt,ot,xt,It,ce,Ye.data):C.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,z,Bt,kt,Ye.width,Ye.height,It,Ye.data):P.texSubImage2D(P.TEXTURE_2D,z,Bt,kt,ot,xt,It,ce,Ye),P.pixelStorei(P.UNPACK_ROW_LENGTH,Se),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Te),P.pixelStorei(P.UNPACK_SKIP_PIXELS,vn),P.pixelStorei(P.UNPACK_SKIP_ROWS,le),P.pixelStorei(P.UNPACK_SKIP_IMAGES,At),z===0&&O.generateMipmaps&&P.generateMipmap(P.TEXTURE_2D),Y.unbindTexture()},this.copyTextureToTexture3D=function(C,O,V=null,G=null,z=0){C.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),V=arguments[0]||null,G=arguments[1]||null,C=arguments[2],O=arguments[3],z=arguments[4]||0);let ot,xt,Tt,wt,Bt,kt,It,ce,Se,Te=C.isCompressedTexture?C.mipmaps[z]:C.image;V!==null?(ot=V.max.x-V.min.x,xt=V.max.y-V.min.y,Tt=V.max.z-V.min.z,wt=V.min.x,Bt=V.min.y,kt=V.min.z):(ot=Te.width,xt=Te.height,Tt=Te.depth,wt=0,Bt=0,kt=0),G!==null?(It=G.x,ce=G.y,Se=G.z):(It=0,ce=0,Se=0);let vn=Gt.convert(O.format),le=Gt.convert(O.type),At;if(O.isData3DTexture)Mt.setTexture3D(O,0),At=P.TEXTURE_3D;else if(O.isDataArrayTexture||O.isCompressedArrayTexture)Mt.setTexture2DArray(O,0),At=P.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}P.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,O.flipY),P.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),P.pixelStorei(P.UNPACK_ALIGNMENT,O.unpackAlignment);let Ye=P.getParameter(P.UNPACK_ROW_LENGTH),ue=P.getParameter(P.UNPACK_IMAGE_HEIGHT),Dn=P.getParameter(P.UNPACK_SKIP_PIXELS),Or=P.getParameter(P.UNPACK_SKIP_ROWS),_n=P.getParameter(P.UNPACK_SKIP_IMAGES);P.pixelStorei(P.UNPACK_ROW_LENGTH,Te.width),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Te.height),P.pixelStorei(P.UNPACK_SKIP_PIXELS,wt),P.pixelStorei(P.UNPACK_SKIP_ROWS,Bt),P.pixelStorei(P.UNPACK_SKIP_IMAGES,kt),C.isDataTexture||C.isData3DTexture?P.texSubImage3D(At,z,It,ce,Se,ot,xt,Tt,vn,le,Te.data):O.isCompressedArrayTexture?P.compressedTexSubImage3D(At,z,It,ce,Se,ot,xt,Tt,vn,Te.data):P.texSubImage3D(At,z,It,ce,Se,ot,xt,Tt,vn,le,Te),P.pixelStorei(P.UNPACK_ROW_LENGTH,Ye),P.pixelStorei(P.UNPACK_IMAGE_HEIGHT,ue),P.pixelStorei(P.UNPACK_SKIP_PIXELS,Dn),P.pixelStorei(P.UNPACK_SKIP_ROWS,Or),P.pixelStorei(P.UNPACK_SKIP_IMAGES,_n),z===0&&O.generateMipmaps&&P.generateMipmap(At),Y.unbindTexture()},this.initRenderTarget=function(C){mt.get(C).__webglFramebuffer===void 0&&Mt.setupRenderTarget(C)},this.initTexture=function(C){C.isCubeTexture?Mt.setTextureCube(C,0):C.isData3DTexture?Mt.setTexture3D(C,0):C.isDataArrayTexture||C.isCompressedArrayTexture?Mt.setTexture2DArray(C,0):Mt.setTexture2D(C,0),Y.unbindTexture()},this.resetState=function(){w=0,S=0,T=null,Y.reset(),Jt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===cu?"display-p3":"srgb",e.unpackColorSpace=se.workingColorSpace===pa?"display-p3":"srgb"}},il=class r{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new at(t),this.density=e}clone(){return new r(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}},rl=class r{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new at(t),this.near=e,this.far=n}clone(){return new r(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},Ni=class extends oe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Sn,this.environmentIntensity=1,this.environmentRotation=new Sn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}},gs=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Fo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=Mn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return Hd("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,s=this.stride;i<s;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Mn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},sn=new R,yr=class r{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.applyMatrix4(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.applyNormalMatrix(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)sn.fromBufferAttribute(this,e),sn.transformDirection(t),this.setXYZ(e,sn.x,sn.y,sn.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=an(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Xt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Xt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Xt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Xt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Xt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=an(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=an(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=an(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=an(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Xt(e,this.array),n=Xt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Xt(e,this.array),n=Xt(n,this.array),i=Xt(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Xt(e,this.array),n=Xt(n,this.array),i=Xt(i,this.array),s=Xt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[i+s])}return new Ft(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new r(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[i+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Wo=class extends We{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new at(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},es,ro=new R,ns=new R,is=new R,rs=new X,so=new X,I0=new dt,Ka=new R,oo=new R,Qa=new R,Pm=new X,$h=new X,Dm=new X,sl=class extends oe{constructor(t=new Wo){if(super(),this.isSprite=!0,this.type="Sprite",es===void 0){es=new Rt;let e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new gs(e,5);es.setIndex([0,1,2,0,2,3]),es.setAttribute("position",new yr(n,3,0,!1)),es.setAttribute("uv",new yr(n,2,3,!1))}this.geometry=es,this.material=t,this.center=new X(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),ns.setFromMatrixScale(this.matrixWorld),I0.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),is.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&ns.multiplyScalar(-is.z);let n=this.material.rotation,i,s;n!==0&&(s=Math.cos(n),i=Math.sin(n));let o=this.center;ja(Ka.set(-.5,-.5,0),is,o,ns,i,s),ja(oo.set(.5,-.5,0),is,o,ns,i,s),ja(Qa.set(.5,.5,0),is,o,ns,i,s),Pm.set(0,0),$h.set(1,0),Dm.set(1,1);let a=t.ray.intersectTriangle(Ka,oo,Qa,!1,ro);if(a===null&&(ja(oo.set(-.5,.5,0),is,o,ns,i,s),$h.set(0,1),a=t.ray.intersectTriangle(Ka,Qa,oo,!1,ro),a===null))return;let c=t.ray.origin.distanceTo(ro);c<t.near||c>t.far||e.push({distance:c,point:ro.clone(),uv:en.getInterpolation(ro,Ka,oo,Qa,Pm,$h,Dm,new X),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}};function ja(r,t,e,n,i,s){rs.subVectors(r,e).addScalar(.5).multiply(n),i!==void 0?(so.x=s*rs.x-i*rs.y,so.y=i*rs.x+s*rs.y):so.copy(rs),r.copy(t),r.x+=so.x,r.y+=so.y,r.applyMatrix4(I0)}var tc=new R,Lm=new R,ol=class extends oe{constructor(){super(),this._currentLevel=0,this.type="LOD",Object.defineProperties(this,{levels:{enumerable:!0,value:[]},isLOD:{value:!0}}),this.autoUpdate=!0}copy(t){super.copy(t,!1);let e=t.levels;for(let n=0,i=e.length;n<i;n++){let s=e[n];this.addLevel(s.object.clone(),s.distance,s.hysteresis)}return this.autoUpdate=t.autoUpdate,this}addLevel(t,e=0,n=0){e=Math.abs(e);let i=this.levels,s;for(s=0;s<i.length&&!(e<i[s].distance);s++);return i.splice(s,0,{distance:e,hysteresis:n,object:t}),this.add(t),this}getCurrentLevel(){return this._currentLevel}getObjectForDistance(t){let e=this.levels;if(e.length>0){let n,i;for(n=1,i=e.length;n<i;n++){let s=e[n].distance;if(e[n].object.visible&&(s-=s*e[n].hysteresis),t<s)break}return e[n-1].object}return null}raycast(t,e){if(this.levels.length>0){tc.setFromMatrixPosition(this.matrixWorld);let i=t.ray.origin.distanceTo(tc);this.getObjectForDistance(i).raycast(t,e)}}update(t){let e=this.levels;if(e.length>1){tc.setFromMatrixPosition(t.matrixWorld),Lm.setFromMatrixPosition(this.matrixWorld);let n=tc.distanceTo(Lm)/t.zoom;e[0].object.visible=!0;let i,s;for(i=1,s=e.length;i<s;i++){let o=e[i].distance;if(e[i].object.visible&&(o-=o*e[i].hysteresis),n>=o)e[i-1].object.visible=!1,e[i].object.visible=!0;else break}for(this._currentLevel=i-1;i<s;i++)e[i].object.visible=!1}}toJSON(t){let e=super.toJSON(t);this.autoUpdate===!1&&(e.object.autoUpdate=!1),e.object.levels=[];let n=this.levels;for(let i=0,s=n.length;i<s;i++){let o=n[i];e.object.levels.push({object:o.object.uuid,distance:o.distance,hysteresis:o.hysteresis})}return e}},Fm=new R,Nm=new Kt,Um=new Kt,AT=new R,Bm=new dt,ec=new R,Zh=new Ue,Om=new dt,Jh=new Di,al=class extends Zt{constructor(t,e){super(t,e),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=df,this.bindMatrix=new dt,this.bindMatrixInverse=new dt,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let t=this.geometry;this.boundingBox===null&&(this.boundingBox=new re),this.boundingBox.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ec),this.boundingBox.expandByPoint(ec)}computeBoundingSphere(){let t=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new Ue),this.boundingSphere.makeEmpty();let e=t.getAttribute("position");for(let n=0;n<e.count;n++)this.getVertexPosition(n,ec),this.boundingSphere.expandByPoint(ec)}copy(t,e){return super.copy(t,e),this.bindMode=t.bindMode,this.bindMatrix.copy(t.bindMatrix),this.bindMatrixInverse.copy(t.bindMatrixInverse),this.skeleton=t.skeleton,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}raycast(t,e){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Zh.copy(this.boundingSphere),Zh.applyMatrix4(i),t.ray.intersectsSphere(Zh)!==!1&&(Om.copy(i).invert(),Jh.copy(t.ray).applyMatrix4(Om),!(this.boundingBox!==null&&Jh.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(t,e,Jh)))}getVertexPosition(t,e){return super.getVertexPosition(t,e),this.applyBoneTransform(t,e),e}bind(t,e){this.skeleton=t,e===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),e=this.matrixWorld),this.bindMatrix.copy(e),this.bindMatrixInverse.copy(e).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let t=new Kt,e=this.geometry.attributes.skinWeight;for(let n=0,i=e.count;n<i;n++){t.fromBufferAttribute(e,n);let s=1/t.manhattanLength();s!==1/0?t.multiplyScalar(s):t.set(1,0,0,0),e.setXYZW(n,t.x,t.y,t.z,t.w)}}updateMatrixWorld(t){super.updateMatrixWorld(t),this.bindMode===df?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===s0?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(t,e){let n=this.skeleton,i=this.geometry;Nm.fromBufferAttribute(i.attributes.skinIndex,t),Um.fromBufferAttribute(i.attributes.skinWeight,t),Fm.copy(e).applyMatrix4(this.bindMatrix),e.set(0,0,0);for(let s=0;s<4;s++){let o=Um.getComponent(s);if(o!==0){let a=Nm.getComponent(s);Bm.multiplyMatrices(n.bones[a].matrixWorld,n.boneInverses[a]),e.addScaledVector(AT.copy(Fm).applyMatrix4(Bm),o)}}return e.applyMatrix4(this.bindMatrixInverse)}},Xo=class extends oe{constructor(){super(),this.isBone=!0,this.type="Bone"}},jt=class extends Be{constructor(t=null,e=1,n=1,i,s,o,a,c,l=Nt,h=Nt,f,u){super(null,o,a,c,l,h,i,s,f,u),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},zm=new dt,ET=new dt,cl=class r{constructor(t=[],e=[]){this.uuid=Mn(),this.bones=t.slice(0),this.boneInverses=e,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let t=this.bones,e=this.boneInverses;if(this.boneMatrices=new Float32Array(t.length*16),e.length===0)this.calculateInverses();else if(t.length!==e.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new dt)}}calculateInverses(){this.boneInverses.length=0;for(let t=0,e=this.bones.length;t<e;t++){let n=new dt;this.bones[t]&&n.copy(this.bones[t].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&n.matrixWorld.copy(this.boneInverses[t]).invert()}for(let t=0,e=this.bones.length;t<e;t++){let n=this.bones[t];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let t=this.bones,e=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let s=0,o=t.length;s<o;s++){let a=t[s]?t[s].matrixWorld:ET;zm.multiplyMatrices(a,e[s]),zm.toArray(n,s*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new r(this.bones,this.boneInverses)}computeBoneTexture(){let t=Math.sqrt(this.bones.length*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4);e.set(this.boneMatrices);let n=new jt(e,t,t,Lt,Dt);return n.needsUpdate=!0,this.boneMatrices=e,this.boneTexture=n,this}getBoneByName(t){for(let e=0,n=this.bones.length;e<n;e++){let i=this.bones[e];if(i.name===t)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(t,e){this.uuid=t.uuid;for(let n=0,i=t.bones.length;n<i;n++){let s=t.bones[n],o=e[s];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),o=new Xo),this.bones.push(o),this.boneInverses.push(new dt().fromArray(t.boneInverses[n]))}return this.init(),this}toJSON(){let t={metadata:{version:4.6,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};t.uuid=this.uuid;let e=this.bones,n=this.boneInverses;for(let i=0,s=e.length;i<s;i++){let o=e[i];t.bones.push(o.uuid);let a=n[i];t.boneInverses.push(a.toArray())}return t}},Ui=class extends Ft{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},ss=new dt,km=new dt,nc=[],Vm=new re,RT=new dt,ao=new Zt,co=new Ue,ll=class extends Zt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Ui(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,RT)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new re),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ss),Vm.copy(t.boundingBox).applyMatrix4(ss),this.boundingBox.union(Vm)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Ue),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ss),co.copy(t.boundingSphere).applyMatrix4(ss),this.boundingSphere.union(co)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,o=t*s+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){let n=this.matrixWorld,i=this.count;if(ao.geometry=this.geometry,ao.material=this.material,ao.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),co.copy(this.boundingSphere),co.applyMatrix4(n),t.ray.intersectsSphere(co)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,ss),km.multiplyMatrices(n,ss),ao.matrixWorld=km,ao.raycast(t,nc);for(let o=0,a=nc.length;o<a;o++){let c=nc[o];c.instanceId=s,c.object=this,e.push(c)}nc.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Ui(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}setMorphAt(t,e){let n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new jt(new Float32Array(i*this.count),i,this.count,Gn,Dt));let s=this.morphTexture.source.data.data,o=0;for(let l=0;l<n.length;l++)o+=n[l];let a=this.geometry.morphTargetsRelative?1:1-o,c=i*t;s[c]=a,s.set(n,c+1)}updateMorphTargets(){}dispose(){return this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null),this}};function CT(r,t){return r.z-t.z}function IT(r,t){return t.z-r.z}var Lf=class{constructor(){this.index=0,this.pool=[],this.list=[]}push(t,e,n){let i=this.pool,s=this.list;this.index>=i.length&&i.push({start:-1,count:-1,z:-1,index:-1});let o=i[this.index];s.push(o),this.index++,o.start=t.start,o.count=t.count,o.z=e,o.index=n}reset(){this.list.length=0,this.index=0}},wi=new dt,Kh=new dt,PT=new dt,DT=new at(1,1,1),Hm=new dt,Qh=new vr,ic=new re,er=new Ue,lo=new R,Gm=new R,LT=new R,jh=new Lf,tn=new Zt,rc=[];function FT(r,t,e=0){let n=t.itemSize;if(r.isInterleavedBufferAttribute||r.array.constructor!==t.array.constructor){let i=r.count;for(let s=0;s<i;s++)for(let o=0;o<n;o++)t.setComponent(s+e,o,r.getComponent(s,o))}else t.array.set(r.array,e*n);t.needsUpdate=!0}var ul=class extends Zt{get maxInstanceCount(){return this._maxInstanceCount}constructor(t,e,n=e*2,i){super(new Rt,i),this.isBatchedMesh=!0,this.perObjectFrustumCulled=!0,this.sortObjects=!0,this.boundingBox=null,this.boundingSphere=null,this.customSort=null,this._drawInfo=[],this._drawRanges=[],this._reservedRanges=[],this._bounds=[],this._maxInstanceCount=t,this._maxVertexCount=e,this._maxIndexCount=n,this._geometryInitialized=!1,this._geometryCount=0,this._multiDrawCounts=new Int32Array(t),this._multiDrawStarts=new Int32Array(t),this._multiDrawCount=0,this._multiDrawInstances=null,this._visibilityChanged=!0,this._matricesTexture=null,this._indirectTexture=null,this._colorsTexture=null,this._initMatricesTexture(),this._initIndirectTexture()}_initMatricesTexture(){let t=Math.sqrt(this._maxInstanceCount*4);t=Math.ceil(t/4)*4,t=Math.max(t,4);let e=new Float32Array(t*t*4),n=new jt(e,t,t,Lt,Dt);this._matricesTexture=n}_initIndirectTexture(){let t=Math.sqrt(this._maxInstanceCount);t=Math.ceil(t);let e=new Uint32Array(t*t),n=new jt(e,t,t,Cr,nn);this._indirectTexture=n}_initColorsTexture(){let t=Math.sqrt(this._maxIndexCount);t=Math.ceil(t);let e=new Float32Array(t*t*4).fill(1),n=new jt(e,t,t,Lt,Dt);n.colorSpace=se.workingColorSpace,this._colorsTexture=n}_initializeGeometry(t){let e=this.geometry,n=this._maxVertexCount,i=this._maxIndexCount;if(this._geometryInitialized===!1){for(let s in t.attributes){let o=t.getAttribute(s),{array:a,itemSize:c,normalized:l}=o,h=new a.constructor(n*c),f=new Ft(h,c,l);e.setAttribute(s,f)}if(t.getIndex()!==null){let s=n>65535?new Uint32Array(i):new Uint16Array(i);e.setIndex(new Ft(s,1))}this._geometryInitialized=!0}}_validateGeometry(t){let e=this.geometry;if(!!t.getIndex()!=!!e.getIndex())throw new Error('BatchedMesh: All geometries must consistently have "index".');for(let n in e.attributes){if(!t.hasAttribute(n))throw new Error(`BatchedMesh: Added geometry missing "${n}". All geometries must have consistent attributes.`);let i=t.getAttribute(n),s=e.getAttribute(n);if(i.itemSize!==s.itemSize||i.normalized!==s.normalized)throw new Error("BatchedMesh: All attributes must have a consistent itemSize and normalized value.")}}setCustomSort(t){return this.customSort=t,this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new re);let t=this._geometryCount,e=this.boundingBox,n=this._drawInfo;e.makeEmpty();for(let i=0;i<t;i++){if(n[i].active===!1)continue;let s=n[i].geometryIndex;this.getMatrixAt(i,wi),this.getBoundingBoxAt(s,ic).applyMatrix4(wi),e.union(ic)}}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Ue);let t=this.boundingSphere,e=this._drawInfo;t.makeEmpty();for(let n=0,i=e.length;n<i;n++){if(e[n].active===!1)continue;let s=e[n].geometryIndex;this.getMatrixAt(n,wi),this.getBoundingSphereAt(s,er).applyMatrix4(wi),t.union(er)}}addInstance(t){if(this._drawInfo.length>=this._maxInstanceCount)throw new Error("BatchedMesh: Maximum item count reached.");this._drawInfo.push({visible:!0,active:!0,geometryIndex:t});let e=this._drawInfo.length-1,n=this._matricesTexture,i=n.image.data;PT.toArray(i,e*16),n.needsUpdate=!0;let s=this._colorsTexture;return s&&(DT.toArray(s.image.data,e*4),s.needsUpdate=!0),e}addGeometry(t,e=-1,n=-1){if(this._initializeGeometry(t),this._validateGeometry(t),this._drawInfo.length>=this._maxInstanceCount)throw new Error("BatchedMesh: Maximum item count reached.");let i={vertexStart:-1,vertexCount:-1,indexStart:-1,indexCount:-1},s=null,o=this._reservedRanges,a=this._drawRanges,c=this._bounds;this._geometryCount!==0&&(s=o[o.length-1]),e===-1?i.vertexCount=t.getAttribute("position").count:i.vertexCount=e,s===null?i.vertexStart=0:i.vertexStart=s.vertexStart+s.vertexCount;let l=t.getIndex(),h=l!==null;if(h&&(n===-1?i.indexCount=l.count:i.indexCount=n,s===null?i.indexStart=0:i.indexStart=s.indexStart+s.indexCount),i.indexStart!==-1&&i.indexStart+i.indexCount>this._maxIndexCount||i.vertexStart+i.vertexCount>this._maxVertexCount)throw new Error("BatchedMesh: Reserved space request exceeds the maximum buffer size.");let f=this._geometryCount;return this._geometryCount++,o.push(i),a.push({start:h?i.indexStart:i.vertexStart,count:-1}),c.push({boxInitialized:!1,box:new re,sphereInitialized:!1,sphere:new Ue}),this.setGeometryAt(f,t),f}setGeometryAt(t,e){if(t>=this._geometryCount)throw new Error("BatchedMesh: Maximum geometry count reached.");this._validateGeometry(e);let n=this.geometry,i=n.getIndex()!==null,s=n.getIndex(),o=e.getIndex(),a=this._reservedRanges[t];if(i&&o.count>a.indexCount||e.attributes.position.count>a.vertexCount)throw new Error("BatchedMesh: Reserved space not large enough for provided geometry.");let c=a.vertexStart,l=a.vertexCount;for(let d in n.attributes){let g=e.getAttribute(d),x=n.getAttribute(d);FT(g,x,c);let p=g.itemSize;for(let m=g.count,_=l;m<_;m++){let v=c+m;for(let y=0;y<p;y++)x.setComponent(v,y,0)}x.needsUpdate=!0,x.addUpdateRange(c*p,l*p)}if(i){let d=a.indexStart;for(let g=0;g<o.count;g++)s.setX(d+g,c+o.getX(g));for(let g=o.count,x=a.indexCount;g<x;g++)s.setX(d+g,c);s.needsUpdate=!0,s.addUpdateRange(d,a.indexCount)}let h=this._bounds[t];e.boundingBox!==null?(h.box.copy(e.boundingBox),h.boxInitialized=!0):h.boxInitialized=!1,e.boundingSphere!==null?(h.sphere.copy(e.boundingSphere),h.sphereInitialized=!0):h.sphereInitialized=!1;let f=this._drawRanges[t],u=e.getAttribute("position");return f.count=i?o.count:u.count,this._visibilityChanged=!0,t}getBoundingBoxAt(t,e){if(t>=this._geometryCount)return null;let n=this._bounds[t],i=n.box,s=this.geometry;if(n.boxInitialized===!1){i.makeEmpty();let o=s.index,a=s.attributes.position,c=this._drawRanges[t];for(let l=c.start,h=c.start+c.count;l<h;l++){let f=l;o&&(f=o.getX(f)),i.expandByPoint(lo.fromBufferAttribute(a,f))}n.boxInitialized=!0}return e.copy(i),e}getBoundingSphereAt(t,e){if(t>=this._geometryCount)return null;let n=this._bounds[t],i=n.sphere,s=this.geometry;if(n.sphereInitialized===!1){i.makeEmpty(),this.getBoundingBoxAt(t,ic),ic.getCenter(i.center);let o=s.index,a=s.attributes.position,c=this._drawRanges[t],l=0;for(let h=c.start,f=c.start+c.count;h<f;h++){let u=h;o&&(u=o.getX(u)),lo.fromBufferAttribute(a,u),l=Math.max(l,i.center.distanceToSquared(lo))}i.radius=Math.sqrt(l),n.sphereInitialized=!0}return e.copy(i),e}setMatrixAt(t,e){let n=this._drawInfo,i=this._matricesTexture,s=this._matricesTexture.image.data;return t>=n.length||n[t].active===!1?this:(e.toArray(s,t*16),i.needsUpdate=!0,this)}getMatrixAt(t,e){let n=this._drawInfo,i=this._matricesTexture.image.data;return t>=n.length||n[t].active===!1?null:e.fromArray(i,t*16)}setColorAt(t,e){this._colorsTexture===null&&this._initColorsTexture();let n=this._colorsTexture,i=this._colorsTexture.image.data,s=this._drawInfo;return t>=s.length||s[t].active===!1?this:(e.toArray(i,t*4),n.needsUpdate=!0,this)}getColorAt(t,e){let n=this._colorsTexture.image.data,i=this._drawInfo;return t>=i.length||i[t].active===!1?null:e.fromArray(n,t*4)}setVisibleAt(t,e){let n=this._drawInfo;return t>=n.length||n[t].active===!1||n[t].visible===e?this:(n[t].visible=e,this._visibilityChanged=!0,this)}getVisibleAt(t){let e=this._drawInfo;return t>=e.length||e[t].active===!1?!1:e[t].visible}raycast(t,e){let n=this._drawInfo,i=this._drawRanges,s=this.matrixWorld,o=this.geometry;tn.material=this.material,tn.geometry.index=o.index,tn.geometry.attributes=o.attributes,tn.geometry.boundingBox===null&&(tn.geometry.boundingBox=new re),tn.geometry.boundingSphere===null&&(tn.geometry.boundingSphere=new Ue);for(let a=0,c=n.length;a<c;a++){if(!n[a].visible||!n[a].active)continue;let l=n[a].geometryIndex,h=i[l];tn.geometry.setDrawRange(h.start,h.count),this.getMatrixAt(a,tn.matrixWorld).premultiply(s),this.getBoundingBoxAt(l,tn.geometry.boundingBox),this.getBoundingSphereAt(l,tn.geometry.boundingSphere),tn.raycast(t,rc);for(let f=0,u=rc.length;f<u;f++){let d=rc[f];d.object=this,d.batchId=a,e.push(d)}rc.length=0}tn.material=null,tn.geometry.index=null,tn.geometry.attributes={},tn.geometry.setDrawRange(0,1/0)}copy(t){return super.copy(t),this.geometry=t.geometry.clone(),this.perObjectFrustumCulled=t.perObjectFrustumCulled,this.sortObjects=t.sortObjects,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this._drawRanges=t._drawRanges.map(e=>({...e})),this._reservedRanges=t._reservedRanges.map(e=>({...e})),this._drawInfo=t._drawInfo.map(e=>({...e})),this._bounds=t._bounds.map(e=>({boxInitialized:e.boxInitialized,box:e.box.clone(),sphereInitialized:e.sphereInitialized,sphere:e.sphere.clone()})),this._maxInstanceCount=t._maxInstanceCount,this._maxVertexCount=t._maxVertexCount,this._maxIndexCount=t._maxIndexCount,this._geometryInitialized=t._geometryInitialized,this._geometryCount=t._geometryCount,this._multiDrawCounts=t._multiDrawCounts.slice(),this._multiDrawStarts=t._multiDrawStarts.slice(),this._matricesTexture=t._matricesTexture.clone(),this._matricesTexture.image.data=this._matricesTexture.image.slice(),this._colorsTexture!==null&&(this._colorsTexture=t._colorsTexture.clone(),this._colorsTexture.image.data=this._colorsTexture.image.slice()),this}dispose(){return this.geometry.dispose(),this._matricesTexture.dispose(),this._matricesTexture=null,this._indirectTexture.dispose(),this._indirectTexture=null,this._colorsTexture!==null&&(this._colorsTexture.dispose(),this._colorsTexture=null),this}onBeforeRender(t,e,n,i,s){if(!this._visibilityChanged&&!this.perObjectFrustumCulled&&!this.sortObjects)return;let o=i.getIndex(),a=o===null?1:o.array.BYTES_PER_ELEMENT,c=this._drawInfo,l=this._multiDrawStarts,h=this._multiDrawCounts,f=this._drawRanges,u=this.perObjectFrustumCulled,d=this._indirectTexture,g=d.image.data;u&&(Hm.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse).multiply(this.matrixWorld),Qh.setFromProjectionMatrix(Hm,t.coordinateSystem));let x=0;if(this.sortObjects){Kh.copy(this.matrixWorld).invert(),lo.setFromMatrixPosition(n.matrixWorld).applyMatrix4(Kh),Gm.set(0,0,-1).transformDirection(n.matrixWorld).transformDirection(Kh);for(let _=0,v=c.length;_<v;_++)if(c[_].visible&&c[_].active){let y=c[_].geometryIndex;this.getMatrixAt(_,wi),this.getBoundingSphereAt(y,er).applyMatrix4(wi);let w=!1;if(u&&(w=!Qh.intersectsSphere(er)),!w){let S=LT.subVectors(er.center,lo).dot(Gm);jh.push(f[y],S,_)}}let p=jh.list,m=this.customSort;m===null?p.sort(s.transparent?IT:CT):m.call(this,p,n);for(let _=0,v=p.length;_<v;_++){let y=p[_];l[x]=y.start*a,h[x]=y.count,g[x]=y.index,x++}jh.reset()}else for(let p=0,m=c.length;p<m;p++)if(c[p].visible&&c[p].active){let _=c[p].geometryIndex,v=!1;if(u&&(this.getMatrixAt(p,wi),this.getBoundingSphereAt(_,er).applyMatrix4(wi),v=!Qh.intersectsSphere(er)),!v){let y=f[_];l[x]=y.start*a,h[x]=y.count,g[x]=p,x++}}d.needsUpdate=!0,this._multiDrawCount=x,this._visibilityChanged=!1}onBeforeShadow(t,e,n,i,s,o){this.onBeforeRender(t,null,i,s,o)}},Ze=class extends We{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new at(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},hl=new R,fl=new R,Wm=new dt,uo=new Di,sc=new Ue,tf=new R,Xm=new R,Qn=class extends oe{constructor(t=new Rt,e=new Ze){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let i=1,s=e.count;i<s;i++)hl.fromBufferAttribute(e,i-1),fl.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=hl.distanceTo(fl);t.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,s=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),sc.copy(n.boundingSphere),sc.applyMatrix4(i),sc.radius+=s,t.ray.intersectsSphere(sc)===!1)return;Wm.copy(i).invert(),uo.copy(t.ray).applyMatrix4(Wm);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){let d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=d,p=g-1;x<p;x+=l){let m=h.getX(x),_=h.getX(x+1),v=oc(this,t,uo,c,m,_);v&&e.push(v)}if(this.isLineLoop){let x=h.getX(g-1),p=h.getX(d),m=oc(this,t,uo,c,x,p);m&&e.push(m)}}else{let d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=d,p=g-1;x<p;x+=l){let m=oc(this,t,uo,c,x,x+1);m&&e.push(m)}if(this.isLineLoop){let x=oc(this,t,uo,c,g-1,d);x&&e.push(x)}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function oc(r,t,e,n,i,s){let o=r.geometry.attributes.position;if(hl.fromBufferAttribute(o,i),fl.fromBufferAttribute(o,s),e.distanceSqToSegment(hl,fl,tf,Xm)>n)return;tf.applyMatrix4(r.matrixWorld);let c=t.ray.origin.distanceTo(tf);if(!(c<t.near||c>t.far))return{distance:c,point:Xm.clone().applyMatrix4(r.matrixWorld),index:i,face:null,faceIndex:null,object:r}}var qm=new R,Ym=new R,Cn=class extends Qn{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let i=0,s=e.count;i<s;i+=2)qm.fromBufferAttribute(e,i),Ym.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+qm.distanceTo(Ym);t.setAttribute("lineDistance",new yt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},dl=class extends Qn{constructor(t,e){super(t,e),this.isLineLoop=!0,this.type="LineLoop"}},qo=class extends We{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new at(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}},$m=new dt,Ff=new Di,ac=new Ue,cc=new R,pl=class extends oe{constructor(t=new Rt,e=new qo){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){let n=this.geometry,i=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ac.copy(n.boundingSphere),ac.applyMatrix4(i),ac.radius+=s,t.ray.intersectsSphere(ac)===!1)return;$m.copy(i).invert(),Ff.copy(t.ray).applyMatrix4($m);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,f=n.attributes.position;if(l!==null){let u=Math.max(0,o.start),d=Math.min(l.count,o.start+o.count);for(let g=u,x=d;g<x;g++){let p=l.getX(g);cc.fromBufferAttribute(f,p),Zm(cc,p,c,i,t,e,this)}}else{let u=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let g=u,x=d;g<x;g++)cc.fromBufferAttribute(f,g),Zm(cc,g,c,i,t,e,this)}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Zm(r,t,e,n,i,s,o){let a=Ff.distanceSqToPoint(r);if(a<e){let c=new R;Ff.closestPointToPoint(r,c),c.applyMatrix4(n);let l=i.ray.origin.distanceTo(c);if(l<i.near||l>i.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}var Nf=class extends Be{constructor(t,e,n,i,s,o,a,c,l){super(t,e,n,i,s,o,a,c,l),this.isVideoTexture=!0,this.minFilter=o!==void 0?o:Qt,this.magFilter=s!==void 0?s:Qt,this.generateMipmaps=!1;let h=this;function f(){h.needsUpdate=!0,t.requestVideoFrameCallback(f)}"requestVideoFrameCallback"in t&&t.requestVideoFrameCallback(f)}clone(){return new this.constructor(this.image).copy(this)}update(){let t=this.image;"requestVideoFrameCallback"in t===!1&&t.readyState>=t.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}},Uf=class extends Be{constructor(t,e){super({width:t,height:e}),this.isFramebufferTexture=!0,this.magFilter=Nt,this.minFilter=Nt,this.generateMipmaps=!1,this.needsUpdate=!0}},xs=class extends Be{constructor(t,e,n,i,s,o,a,c,l,h,f,u){super(null,o,a,c,l,h,i,s,f,u),this.isCompressedTexture=!0,this.image={width:e,height:n},this.mipmaps=t,this.flipY=!1,this.generateMipmaps=!1}},Bf=class extends xs{constructor(t,e,n,i,s,o){super(t,e,n,s,o),this.isCompressedArrayTexture=!0,this.image.depth=i,this.wrapR=ge,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}},Of=class extends xs{constructor(t,e,n){super(void 0,t[0].width,t[0].height,e,n,di),this.isCompressedCubeTexture=!0,this.isCubeTexture=!0,this.image=t}},zf=class extends Be{constructor(t,e,n,i,s,o,a,c,l){super(t,e,n,i,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}},Tn=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,i=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(i),e.push(s),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),i=0,s=n.length,o;e?o=e:o=t*n[s-1];let a=0,c=s-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(s-1);let h=n[i],u=n[i+1]-h,d=(o-h)/u;return(i+d)/(s-1)}getTangent(t,e){let i=t-1e-4,s=t+1e-4;i<0&&(i=0),s>1&&(s=1);let o=this.getPoint(i),a=this.getPoint(s),c=e||(o.isVector2?new X:new R);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new R,i=[],s=[],o=[],a=new R,c=new dt;for(let d=0;d<=t;d++){let g=d/t;i[d]=this.getTangentAt(g,new R)}s[0]=new R,o[0]=new R;let l=Number.MAX_VALUE,h=Math.abs(i[0].x),f=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),f<=l&&(l=f,n.set(0,1,0)),u<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],a),o[0].crossVectors(i[0],s[0]);for(let d=1;d<=t;d++){if(s[d]=s[d-1].clone(),o[d]=o[d-1].clone(),a.crossVectors(i[d-1],i[d]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(Ae(i[d-1].dot(i[d]),-1,1));s[d].applyMatrix4(c.makeRotationAxis(a,g))}o[d].crossVectors(i[d],s[d])}if(e===!0){let d=Math.acos(Ae(s[0].dot(s[t]),-1,1));d/=t,i[0].dot(a.crossVectors(s[0],s[t]))>0&&(d=-d);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(i[g],d*g)),o[g].crossVectors(i[g],s[g])}return{tangents:i,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},vs=class extends Tn{constructor(t=0,e=0,n=1,i=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new X){let n=e,i=Math.PI*2,s=this.aEndAngle-this.aStartAngle,o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(o?s=0:s=i),this.aClockwise===!0&&!o&&(s===i?s=-i:s=s-i);let a=this.aStartAngle+t*s,c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){let h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=c-this.aX,d=l-this.aY;c=u*h-d*f+this.aX,l=u*f+d*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},ml=class extends vs{constructor(t,e,n,i,s,o){super(t,e,n,n,i,s,o),this.isArcCurve=!0,this.type="ArcCurve"}};function Wd(){let r=0,t=0,e=0,n=0;function i(s,o,a,c){r=s,t=a,e=-3*s+3*o-2*a-c,n=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){i(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,h,f){let u=(o-s)/l-(a-s)/(l+h)+(a-o)/h,d=(a-o)/h-(c-o)/(h+f)+(c-a)/f;u*=h,d*=h,i(o,a,u,d)},calc:function(s){let o=s*s,a=o*s;return r+t*s+e*o+n*a}}}var lc=new R,ef=new Wd,nf=new Wd,rf=new Wd,gl=class extends Tn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new R){let n=e,i=this.points,s=i.length,o=(s-(this.closed?0:1))*t,a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%s]:(lc.subVectors(i[0],i[1]).add(i[0]),l=lc);let f=i[a%s],u=i[(a+1)%s];if(this.closed||a+2<s?h=i[(a+2)%s]:(lc.subVectors(i[s-1],i[s-2]).add(i[s-1]),h=lc),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,g=Math.pow(l.distanceToSquared(f),d),x=Math.pow(f.distanceToSquared(u),d),p=Math.pow(u.distanceToSquared(h),d);x<1e-4&&(x=1),g<1e-4&&(g=x),p<1e-4&&(p=x),ef.initNonuniformCatmullRom(l.x,f.x,u.x,h.x,g,x,p),nf.initNonuniformCatmullRom(l.y,f.y,u.y,h.y,g,x,p),rf.initNonuniformCatmullRom(l.z,f.z,u.z,h.z,g,x,p)}else this.curveType==="catmullrom"&&(ef.initCatmullRom(l.x,f.x,u.x,h.x,this.tension),nf.initCatmullRom(l.y,f.y,u.y,h.y,this.tension),rf.initCatmullRom(l.z,f.z,u.z,h.z,this.tension));return n.set(ef.calc(c),nf.calc(c),rf.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new R().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function Jm(r,t,e,n,i){let s=(n-t)*.5,o=(i-e)*.5,a=r*r,c=r*a;return(2*e-2*n+s+o)*c+(-3*e+3*n-2*s-o)*a+s*r+e}function NT(r,t){let e=1-r;return e*e*t}function UT(r,t){return 2*(1-r)*r*t}function BT(r,t){return r*r*t}function So(r,t,e,n){return NT(r,t)+UT(r,e)+BT(r,n)}function OT(r,t){let e=1-r;return e*e*e*t}function zT(r,t){let e=1-r;return 3*e*e*r*t}function kT(r,t){return 3*(1-r)*r*r*t}function VT(r,t){return r*r*r*t}function To(r,t,e,n,i){return OT(r,t)+zT(r,e)+kT(r,n)+VT(r,i)}var Yo=class extends Tn{constructor(t=new X,e=new X,n=new X,i=new X){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new X){let n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(To(t,i.x,s.x,o.x,a.x),To(t,i.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},xl=class extends Tn{constructor(t=new R,e=new R,n=new R,i=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new R){let n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(To(t,i.x,s.x,o.x,a.x),To(t,i.y,s.y,o.y,a.y),To(t,i.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},$o=class extends Tn{constructor(t=new X,e=new X){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new X){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new X){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},vl=class extends Tn{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Zo=class extends Tn{constructor(t=new X,e=new X,n=new X){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new X){let n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(So(t,i.x,s.x,o.x),So(t,i.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Jo=class extends Tn{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){let n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(So(t,i.x,s.x,o.x),So(t,i.y,s.y,o.y),So(t,i.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Ko=class extends Tn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new X){let n=e,i=this.points,s=(i.length-1)*t,o=Math.floor(s),a=s-o,c=i[o===0?o:o-1],l=i[o],h=i[o>i.length-2?i.length-1:o+1],f=i[o>i.length-3?i.length-1:o+2];return n.set(Jm(a,c.x,l.x,h.x,f.x),Jm(a,c.y,l.y,h.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let i=t.points[e];this.points.push(new X().fromArray(i))}return this}},_l=Object.freeze({__proto__:null,ArcCurve:ml,CatmullRomCurve3:gl,CubicBezierCurve:Yo,CubicBezierCurve3:xl,EllipseCurve:vs,LineCurve:$o,LineCurve3:vl,QuadraticBezierCurve:Zo,QuadraticBezierCurve3:Jo,SplineCurve:Ko}),yl=class extends Tn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new _l[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),i=this.getCurveLengths(),s=0;for(;s<i.length;){if(i[s]>=n){let o=i[s]-n,a=this.curves[s],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}s++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let i=0,s=this.curves;i<s.length;i++){let o=s[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){let h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let i=t.curves[e];this.curves.push(new _l[i.type]().fromJSON(i))}return this}},br=class extends yl{constructor(t){super(),this.type="Path",this.currentPoint=new X,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new $o(this.currentPoint.clone(),new X(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){let s=new Zo(this.currentPoint.clone(),new X(t,e),new X(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,s,o){let a=new Yo(this.currentPoint.clone(),new X(t,e),new X(n,i),new X(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Ko(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,s,o){let a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,i,s,o),this}absarc(t,e,n,i,s,o){return this.absellipse(t,e,n,n,i,s,o),this}ellipse(t,e,n,i,s,o,a,c){let l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,i,s,o,a,c),this}absellipse(t,e,n,i,s,o,a,c){let l=new vs(t,e,n,i,s,o,a,c);if(this.curves.length>0){let f=l.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(l);let h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},Qo=class r extends Rt{constructor(t=[new X(0,-.5),new X(.5,0),new X(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=Ae(i,0,Math.PI*2);let s=[],o=[],a=[],c=[],l=[],h=1/e,f=new R,u=new X,d=new R,g=new R,x=new R,p=0,m=0;for(let _=0;_<=t.length-1;_++)switch(_){case 0:p=t[_+1].x-t[_].x,m=t[_+1].y-t[_].y,d.x=m*1,d.y=-p,d.z=m*0,x.copy(d),d.normalize(),c.push(d.x,d.y,d.z);break;case t.length-1:c.push(x.x,x.y,x.z);break;default:p=t[_+1].x-t[_].x,m=t[_+1].y-t[_].y,d.x=m*1,d.y=-p,d.z=m*0,g.copy(d),d.x+=x.x,d.y+=x.y,d.z+=x.z,d.normalize(),c.push(d.x,d.y,d.z),x.copy(g)}for(let _=0;_<=e;_++){let v=n+_*h*i,y=Math.sin(v),w=Math.cos(v);for(let S=0;S<=t.length-1;S++){f.x=t[S].x*y,f.y=t[S].y,f.z=t[S].x*w,o.push(f.x,f.y,f.z),u.x=_/e,u.y=S/(t.length-1),a.push(u.x,u.y);let T=c[3*S+0]*y,A=c[3*S+1],M=c[3*S+0]*w;l.push(T,A,M)}}for(let _=0;_<e;_++)for(let v=0;v<t.length-1;v++){let y=v+_*t.length,w=y,S=y+t.length,T=y+t.length+1,A=y+1;s.push(w,S,A),s.push(T,A,S)}this.setIndex(s),this.setAttribute("position",new yt(o,3)),this.setAttribute("uv",new yt(a,2)),this.setAttribute("normal",new yt(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.points,t.segments,t.phiStart,t.phiLength)}},bl=class r extends Qo{constructor(t=1,e=1,n=4,i=8){let s=new br;s.absarc(0,-e/2,t,Math.PI*1.5,0),s.absarc(0,e/2,t,0,Math.PI*.5),super(s.getPoints(n),i),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:i}}static fromJSON(t){return new r(t.radius,t.length,t.capSegments,t.radialSegments)}},Ml=class r extends Rt{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);let s=[],o=[],a=[],c=[],l=new R,h=new X;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let f=0,u=3;f<=e;f++,u+=3){let d=n+f/e*i;l.x=t*Math.cos(d),l.y=t*Math.sin(d),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[u]/t+1)/2,h.y=(o[u+1]/t+1)/2,c.push(h.x,h.y)}for(let f=1;f<=e;f++)s.push(f,f+1,0);this.setIndex(s),this.setAttribute("position",new yt(o,3)),this.setAttribute("normal",new yt(a,3)),this.setAttribute("uv",new yt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.segments,t.thetaStart,t.thetaLength)}},_s=class r extends Rt{constructor(t=1,e=1,n=1,i=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};let l=this;i=Math.floor(i),s=Math.floor(s);let h=[],f=[],u=[],d=[],g=0,x=[],p=n/2,m=0;_(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new yt(f,3)),this.setAttribute("normal",new yt(u,3)),this.setAttribute("uv",new yt(d,2));function _(){let y=new R,w=new R,S=0,T=(e-t)/n;for(let A=0;A<=s;A++){let M=[],b=A/s,I=b*(e-t)+t;for(let D=0;D<=i;D++){let F=D/i,N=F*c+a,k=Math.sin(N),U=Math.cos(N);w.x=I*k,w.y=-b*n+p,w.z=I*U,f.push(w.x,w.y,w.z),y.set(k,T,U).normalize(),u.push(y.x,y.y,y.z),d.push(F,1-b),M.push(g++)}x.push(M)}for(let A=0;A<i;A++)for(let M=0;M<s;M++){let b=x[M][A],I=x[M+1][A],D=x[M+1][A+1],F=x[M][A+1];h.push(b,I,F),h.push(I,D,F),S+=6}l.addGroup(m,S,0),m+=S}function v(y){let w=g,S=new X,T=new R,A=0,M=y===!0?t:e,b=y===!0?1:-1;for(let D=1;D<=i;D++)f.push(0,p*b,0),u.push(0,b,0),d.push(.5,.5),g++;let I=g;for(let D=0;D<=i;D++){let N=D/i*c+a,k=Math.cos(N),U=Math.sin(N);T.x=M*U,T.y=p*b,T.z=M*k,f.push(T.x,T.y,T.z),u.push(0,b,0),S.x=k*.5+.5,S.y=U*.5*b+.5,d.push(S.x,S.y),g++}for(let D=0;D<i;D++){let F=w+D,N=I+D;y===!0?h.push(N,N+1,F):h.push(N+1,N,F),A+=3}l.addGroup(m,A,y===!0?1:2),m+=A}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Sl=class r extends _s{constructor(t=1,e=1,n=32,i=1,s=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,s,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(t){return new r(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Bi=class r extends Rt{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};let s=[],o=[];a(i),l(n),h(),this.setAttribute("position",new yt(s,3)),this.setAttribute("normal",new yt(s.slice(),3)),this.setAttribute("uv",new yt(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(_){let v=new R,y=new R,w=new R;for(let S=0;S<e.length;S+=3)d(e[S+0],v),d(e[S+1],y),d(e[S+2],w),c(v,y,w,_)}function c(_,v,y,w){let S=w+1,T=[];for(let A=0;A<=S;A++){T[A]=[];let M=_.clone().lerp(y,A/S),b=v.clone().lerp(y,A/S),I=S-A;for(let D=0;D<=I;D++)D===0&&A===S?T[A][D]=M:T[A][D]=M.clone().lerp(b,D/I)}for(let A=0;A<S;A++)for(let M=0;M<2*(S-A)-1;M++){let b=Math.floor(M/2);M%2===0?(u(T[A][b+1]),u(T[A+1][b]),u(T[A][b])):(u(T[A][b+1]),u(T[A+1][b+1]),u(T[A+1][b]))}}function l(_){let v=new R;for(let y=0;y<s.length;y+=3)v.x=s[y+0],v.y=s[y+1],v.z=s[y+2],v.normalize().multiplyScalar(_),s[y+0]=v.x,s[y+1]=v.y,s[y+2]=v.z}function h(){let _=new R;for(let v=0;v<s.length;v+=3){_.x=s[v+0],_.y=s[v+1],_.z=s[v+2];let y=p(_)/2/Math.PI+.5,w=m(_)/Math.PI+.5;o.push(y,1-w)}g(),f()}function f(){for(let _=0;_<o.length;_+=6){let v=o[_+0],y=o[_+2],w=o[_+4],S=Math.max(v,y,w),T=Math.min(v,y,w);S>.9&&T<.1&&(v<.2&&(o[_+0]+=1),y<.2&&(o[_+2]+=1),w<.2&&(o[_+4]+=1))}}function u(_){s.push(_.x,_.y,_.z)}function d(_,v){let y=_*3;v.x=t[y+0],v.y=t[y+1],v.z=t[y+2]}function g(){let _=new R,v=new R,y=new R,w=new R,S=new X,T=new X,A=new X;for(let M=0,b=0;M<s.length;M+=9,b+=6){_.set(s[M+0],s[M+1],s[M+2]),v.set(s[M+3],s[M+4],s[M+5]),y.set(s[M+6],s[M+7],s[M+8]),S.set(o[b+0],o[b+1]),T.set(o[b+2],o[b+3]),A.set(o[b+4],o[b+5]),w.copy(_).add(v).add(y).divideScalar(3);let I=p(w);x(S,b+0,_,I),x(T,b+2,v,I),x(A,b+4,y,I)}}function x(_,v,y,w){w<0&&_.x===1&&(o[v]=_.x-1),y.x===0&&y.z===0&&(o[v]=w/2/Math.PI+.5)}function p(_){return Math.atan2(_.z,-_.x)}function m(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.vertices,t.indices,t.radius,t.details)}},Tl=class r extends Bi{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new r(t.radius,t.detail)}},uc=new R,hc=new R,sf=new R,fc=new en,wl=class extends Rt{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){let i=Math.pow(10,4),s=Math.cos(pr*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],f=new Array(3),u={},d=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);let{a:x,b:p,c:m}=fc;if(x.fromBufferAttribute(a,l[0]),p.fromBufferAttribute(a,l[1]),m.fromBufferAttribute(a,l[2]),fc.getNormal(sf),f[0]=`${Math.round(x.x*i)},${Math.round(x.y*i)},${Math.round(x.z*i)}`,f[1]=`${Math.round(p.x*i)},${Math.round(p.y*i)},${Math.round(p.z*i)}`,f[2]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let _=0;_<3;_++){let v=(_+1)%3,y=f[_],w=f[v],S=fc[h[_]],T=fc[h[v]],A=`${y}_${w}`,M=`${w}_${y}`;M in u&&u[M]?(sf.dot(u[M].normal)<=s&&(d.push(S.x,S.y,S.z),d.push(T.x,T.y,T.z)),u[M]=null):A in u||(u[A]={index0:l[_],index1:l[v],normal:sf.clone()})}}for(let g in u)if(u[g]){let{index0:x,index1:p}=u[g];uc.fromBufferAttribute(a,x),hc.fromBufferAttribute(a,p),d.push(uc.x,uc.y,uc.z),d.push(hc.x,hc.y,hc.z)}this.setAttribute("position",new yt(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}},fi=class extends br{constructor(t){super(t),this.uuid=Mn(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let i=t.holes[e];this.holes.push(new br().fromJSON(i))}return this}},HT={triangulate:function(r,t,e=2){let n=t&&t.length,i=n?t[0]*e:r.length,s=P0(r,0,i,e,!0),o=[];if(!s||s.next===s.prev)return o;let a,c,l,h,f,u,d;if(n&&(s=YT(r,t,s,e)),r.length>80*e){a=l=r[0],c=h=r[1];for(let g=e;g<i;g+=e)f=r[g],u=r[g+1],f<a&&(a=f),u<c&&(c=u),f>l&&(l=f),u>h&&(h=u);d=Math.max(l-a,h-c),d=d!==0?32767/d:0}return jo(s,o,e,a,c,d,0),o}};function P0(r,t,e,n,i){let s,o;if(i===rw(r,t,e,n)>0)for(s=t;s<e;s+=n)o=Km(s,r[s],r[s+1],o);else for(s=e-n;s>=t;s-=n)o=Km(s,r[s],r[s+1],o);return o&&uu(o,o.next)&&(ea(o),o=o.next),o}function Mr(r,t){if(!r)return r;t||(t=r);let e=r,n;do if(n=!1,!e.steiner&&(uu(e,e.next)||ye(e.prev,e,e.next)===0)){if(ea(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function jo(r,t,e,n,i,s,o){if(!r)return;!o&&s&&QT(r,n,i,s);let a=r,c,l;for(;r.prev!==r.next;){if(c=r.prev,l=r.next,s?WT(r,n,i,s):GT(r)){t.push(c.i/e|0),t.push(r.i/e|0),t.push(l.i/e|0),ea(r),r=l.next,a=l.next;continue}if(r=l,r===a){o?o===1?(r=XT(Mr(r),t,e),jo(r,t,e,n,i,s,2)):o===2&&qT(r,t,e,n,i,s):jo(Mr(r),t,e,n,i,s,1);break}}}function GT(r){let t=r.prev,e=r,n=r.next;if(ye(t,e,n)>=0)return!1;let i=t.x,s=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=i<s?i<o?i:o:s<o?s:o,f=a<c?a<l?a:l:c<l?c:l,u=i>s?i>o?i:o:s>o?s:o,d=a>c?a>l?a:l:c>l?c:l,g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=u&&g.y>=f&&g.y<=d&&ls(i,a,s,c,o,l,g.x,g.y)&&ye(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function WT(r,t,e,n){let i=r.prev,s=r,o=r.next;if(ye(i,s,o)>=0)return!1;let a=i.x,c=s.x,l=o.x,h=i.y,f=s.y,u=o.y,d=a<c?a<l?a:l:c<l?c:l,g=h<f?h<u?h:u:f<u?f:u,x=a>c?a>l?a:l:c>l?c:l,p=h>f?h>u?h:u:f>u?f:u,m=kf(d,g,t,e,n),_=kf(x,p,t,e,n),v=r.prevZ,y=r.nextZ;for(;v&&v.z>=m&&y&&y.z<=_;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=p&&v!==i&&v!==o&&ls(a,h,c,f,l,u,v.x,v.y)&&ye(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=d&&y.x<=x&&y.y>=g&&y.y<=p&&y!==i&&y!==o&&ls(a,h,c,f,l,u,y.x,y.y)&&ye(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=m;){if(v.x>=d&&v.x<=x&&v.y>=g&&v.y<=p&&v!==i&&v!==o&&ls(a,h,c,f,l,u,v.x,v.y)&&ye(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=_;){if(y.x>=d&&y.x<=x&&y.y>=g&&y.y<=p&&y!==i&&y!==o&&ls(a,h,c,f,l,u,y.x,y.y)&&ye(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function XT(r,t,e){let n=r;do{let i=n.prev,s=n.next.next;!uu(i,s)&&D0(i,n,n.next,s)&&ta(i,s)&&ta(s,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(s.i/e|0),ea(n),ea(n.next),n=r=s),n=n.next}while(n!==r);return Mr(n)}function qT(r,t,e,n,i,s){let o=r;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&ew(o,a)){let c=L0(o,a);o=Mr(o,o.next),c=Mr(c,c.next),jo(o,t,e,n,i,s,0),jo(c,t,e,n,i,s,0);return}a=a.next}o=o.next}while(o!==r)}function YT(r,t,e,n){let i=[],s,o,a,c,l;for(s=0,o=t.length;s<o;s++)a=t[s]*n,c=s<o-1?t[s+1]*n:r.length,l=P0(r,a,c,n,!1),l===l.next&&(l.steiner=!0),i.push(tw(l));for(i.sort($T),s=0;s<i.length;s++)e=ZT(i[s],e);return e}function $T(r,t){return r.x-t.x}function ZT(r,t){let e=JT(r,t);if(!e)return t;let n=L0(e,r);return Mr(n,n.next),Mr(e,e.next)}function JT(r,t){let e=t,n=-1/0,i,s=r.x,o=r.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){let u=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=s&&u>n&&(n=u,i=e.x<e.next.x?e:e.next,u===s))return i}e=e.next}while(e!==t);if(!i)return null;let a=i,c=i.x,l=i.y,h=1/0,f;e=i;do s>=e.x&&e.x>=c&&s!==e.x&&ls(o<l?s:n,o,c,l,o<l?n:s,o,e.x,e.y)&&(f=Math.abs(o-e.y)/(s-e.x),ta(e,r)&&(f<h||f===h&&(e.x>i.x||e.x===i.x&&KT(i,e)))&&(i=e,h=f)),e=e.next;while(e!==a);return i}function KT(r,t){return ye(r.prev,r,t.prev)<0&&ye(t.next,r,r.next)<0}function QT(r,t,e,n){let i=r;do i.z===0&&(i.z=kf(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,jT(i)}function jT(r){let t,e,n,i,s,o,a,c,l=1;do{for(e=r,r=null,s=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,c--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;e=n}s.nextZ=null,l*=2}while(o>1);return r}function kf(r,t,e,n,i){return r=(r-e)*i|0,t=(t-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function tw(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e}function ls(r,t,e,n,i,s,o,a){return(i-o)*(t-a)>=(r-o)*(s-a)&&(r-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(i-o)*(n-a)}function ew(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!nw(r,t)&&(ta(r,t)&&ta(t,r)&&iw(r,t)&&(ye(r.prev,r,t.prev)||ye(r,t.prev,t))||uu(r,t)&&ye(r.prev,r,r.next)>0&&ye(t.prev,t,t.next)>0)}function ye(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y)}function uu(r,t){return r.x===t.x&&r.y===t.y}function D0(r,t,e,n){let i=pc(ye(r,t,e)),s=pc(ye(r,t,n)),o=pc(ye(e,n,r)),a=pc(ye(e,n,t));return!!(i!==s&&o!==a||i===0&&dc(r,e,t)||s===0&&dc(r,n,t)||o===0&&dc(e,r,n)||a===0&&dc(e,t,n))}function dc(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y)}function pc(r){return r>0?1:r<0?-1:0}function nw(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&D0(e,e.next,r,t))return!0;e=e.next}while(e!==r);return!1}function ta(r,t){return ye(r.prev,r,r.next)<0?ye(r,t,r.next)>=0&&ye(r,r.prev,t)>=0:ye(r,t,r.prev)<0||ye(r,r.next,t)<0}function iw(r,t){let e=r,n=!1,i=(r.x+t.x)/2,s=(r.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&i<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==r);return n}function L0(r,t){let e=new Vf(r.i,r.x,r.y),n=new Vf(t.i,t.x,t.y),i=r.next,s=t.prev;return r.next=t,t.prev=r,e.next=i,i.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function Km(r,t,e,n){let i=new Vf(r,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function ea(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function Vf(r,t,e){this.i=r,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function rw(r,t,e,n){let i=0;for(let s=t,o=e-n;s<e;s+=n)i+=(r[o]-r[s])*(r[s+1]+r[o+1]),o=s;return i}var Kn=class r{static area(t){let e=t.length,n=0;for(let i=e-1,s=0;s<e;i=s++)n+=t[i].x*t[s].y-t[s].x*t[i].y;return n*.5}static isClockWise(t){return r.area(t)<0}static triangulateShape(t,e){let n=[],i=[],s=[];Qm(t),jm(n,t);let o=t.length;e.forEach(Qm);for(let c=0;c<e.length;c++)i.push(o),o+=e[c].length,jm(n,e[c]);let a=HT.triangulate(n,i);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}};function Qm(r){let t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function jm(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y)}var Al=class r extends Rt{constructor(t=new fi([new X(.5,.5),new X(-.5,.5),new X(-.5,-.5),new X(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,i=[],s=[];for(let a=0,c=t.length;a<c;a++){let l=t[a];o(l)}this.setAttribute("position",new yt(i,3)),this.setAttribute("uv",new yt(s,2)),this.computeVertexNormals();function o(a){let c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1,u=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,m=e.extrudePath,_=e.UVGenerator!==void 0?e.UVGenerator:sw,v,y=!1,w,S,T,A;m&&(v=m.getSpacedPoints(h),y=!0,u=!1,w=m.computeFrenetFrames(h,!1),S=new R,T=new R,A=new R),u||(p=0,d=0,g=0,x=0);let M=a.extractPoints(l),b=M.shape,I=M.holes;if(!Kn.isClockWise(b)){b=b.reverse();for(let P=0,it=I.length;P<it;P++){let tt=I[P];Kn.isClockWise(tt)&&(I[P]=tt.reverse())}}let F=Kn.triangulateShape(b,I),N=b;for(let P=0,it=I.length;P<it;P++){let tt=I[P];b=b.concat(tt)}function k(P,it,tt){return it||console.error("THREE.ExtrudeGeometry: vec does not exist"),P.clone().addScaledVector(it,tt)}let U=b.length,$=F.length;function W(P,it,tt){let pt,Y,Ct,mt=P.x-it.x,Mt=P.y-it.y,L=tt.x-P.x,E=tt.y-P.y,H=mt*mt+Mt*Mt,j=mt*E-Mt*L;if(Math.abs(j)>Number.EPSILON){let Q=Math.sqrt(H),K=Math.sqrt(L*L+E*E),Et=it.x-Mt/Q,ht=it.y+mt/Q,_t=tt.x-E/K,Wt=tt.y+L/K,nt=((_t-Et)*E-(Wt-ht)*L)/(mt*E-Mt*L);pt=Et+mt*nt-P.x,Y=ht+Mt*nt-P.y;let vt=pt*pt+Y*Y;if(vt<=2)return new X(pt,Y);Ct=Math.sqrt(vt/2)}else{let Q=!1;mt>Number.EPSILON?L>Number.EPSILON&&(Q=!0):mt<-Number.EPSILON?L<-Number.EPSILON&&(Q=!0):Math.sign(Mt)===Math.sign(E)&&(Q=!0),Q?(pt=-Mt,Y=mt,Ct=Math.sqrt(H)):(pt=mt,Y=Mt,Ct=Math.sqrt(H/2))}return new X(pt/Ct,Y/Ct)}let st=[];for(let P=0,it=N.length,tt=it-1,pt=P+1;P<it;P++,tt++,pt++)tt===it&&(tt=0),pt===it&&(pt=0),st[P]=W(N[P],N[tt],N[pt]);let lt=[],gt,Pt=st.concat();for(let P=0,it=I.length;P<it;P++){let tt=I[P];gt=[];for(let pt=0,Y=tt.length,Ct=Y-1,mt=pt+1;pt<Y;pt++,Ct++,mt++)Ct===Y&&(Ct=0),mt===Y&&(mt=0),gt[pt]=W(tt[pt],tt[Ct],tt[mt]);lt.push(gt),Pt=Pt.concat(gt)}for(let P=0;P<p;P++){let it=P/p,tt=d*Math.cos(it*Math.PI/2),pt=g*Math.sin(it*Math.PI/2)+x;for(let Y=0,Ct=N.length;Y<Ct;Y++){let mt=k(N[Y],st[Y],pt);ft(mt.x,mt.y,-tt)}for(let Y=0,Ct=I.length;Y<Ct;Y++){let mt=I[Y];gt=lt[Y];for(let Mt=0,L=mt.length;Mt<L;Mt++){let E=k(mt[Mt],gt[Mt],pt);ft(E.x,E.y,-tt)}}}let qt=g+x;for(let P=0;P<U;P++){let it=u?k(b[P],Pt[P],qt):b[P];y?(T.copy(w.normals[0]).multiplyScalar(it.x),S.copy(w.binormals[0]).multiplyScalar(it.y),A.copy(v[0]).add(T).add(S),ft(A.x,A.y,A.z)):ft(it.x,it.y,0)}for(let P=1;P<=h;P++)for(let it=0;it<U;it++){let tt=u?k(b[it],Pt[it],qt):b[it];y?(T.copy(w.normals[P]).multiplyScalar(tt.x),S.copy(w.binormals[P]).multiplyScalar(tt.y),A.copy(v[P]).add(T).add(S),ft(A.x,A.y,A.z)):ft(tt.x,tt.y,f/h*P)}for(let P=p-1;P>=0;P--){let it=P/p,tt=d*Math.cos(it*Math.PI/2),pt=g*Math.sin(it*Math.PI/2)+x;for(let Y=0,Ct=N.length;Y<Ct;Y++){let mt=k(N[Y],st[Y],pt);ft(mt.x,mt.y,f+tt)}for(let Y=0,Ct=I.length;Y<Ct;Y++){let mt=I[Y];gt=lt[Y];for(let Mt=0,L=mt.length;Mt<L;Mt++){let E=k(mt[Mt],gt[Mt],pt);y?ft(E.x,E.y+v[h-1].y,v[h-1].x+tt):ft(E.x,E.y,f+tt)}}}q(),et();function q(){let P=i.length/3;if(u){let it=0,tt=U*it;for(let pt=0;pt<$;pt++){let Y=F[pt];Ot(Y[2]+tt,Y[1]+tt,Y[0]+tt)}it=h+p*2,tt=U*it;for(let pt=0;pt<$;pt++){let Y=F[pt];Ot(Y[0]+tt,Y[1]+tt,Y[2]+tt)}}else{for(let it=0;it<$;it++){let tt=F[it];Ot(tt[2],tt[1],tt[0])}for(let it=0;it<$;it++){let tt=F[it];Ot(tt[0]+U*h,tt[1]+U*h,tt[2]+U*h)}}n.addGroup(P,i.length/3-P,0)}function et(){let P=i.length/3,it=0;bt(N,it),it+=N.length;for(let tt=0,pt=I.length;tt<pt;tt++){let Y=I[tt];bt(Y,it),it+=Y.length}n.addGroup(P,i.length/3-P,1)}function bt(P,it){let tt=P.length;for(;--tt>=0;){let pt=tt,Y=tt-1;Y<0&&(Y=P.length-1);for(let Ct=0,mt=h+p*2;Ct<mt;Ct++){let Mt=U*Ct,L=U*(Ct+1),E=it+pt+Mt,H=it+Y+Mt,j=it+Y+L,Q=it+pt+L;$t(E,H,j,Q)}}}function ft(P,it,tt){c.push(P),c.push(it),c.push(tt)}function Ot(P,it,tt){zt(P),zt(it),zt(tt);let pt=i.length/3,Y=_.generateTopUV(n,i,pt-3,pt-2,pt-1);ie(Y[0]),ie(Y[1]),ie(Y[2])}function $t(P,it,tt,pt){zt(P),zt(it),zt(pt),zt(it),zt(tt),zt(pt);let Y=i.length/3,Ct=_.generateSideWallUV(n,i,Y-6,Y-3,Y-2,Y-1);ie(Ct[0]),ie(Ct[1]),ie(Ct[3]),ie(Ct[1]),ie(Ct[2]),ie(Ct[3])}function zt(P){i.push(c[P*3+0]),i.push(c[P*3+1]),i.push(c[P*3+2])}function ie(P){s.push(P.x),s.push(P.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return ow(e,n,t)}static fromJSON(t,e){let n=[];for(let s=0,o=t.shapes.length;s<o;s++){let a=e[t.shapes[s]];n.push(a)}let i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new _l[i.type]().fromJSON(i)),new r(n,t.options)}},sw={generateTopUV:function(r,t,e,n,i){let s=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[i*3],h=t[i*3+1];return[new X(s,o),new X(a,c),new X(l,h)]},generateSideWallUV:function(r,t,e,n,i,s){let o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],f=t[n*3+2],u=t[i*3],d=t[i*3+1],g=t[i*3+2],x=t[s*3],p=t[s*3+1],m=t[s*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new X(o,1-c),new X(l,1-f),new X(u,1-g),new X(x,1-m)]:[new X(a,1-c),new X(h,1-f),new X(d,1-g),new X(p,1-m)]}};function ow(r,t,e){if(e.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){let s=r[n];e.shapes.push(s.uuid)}else e.shapes.push(r.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var El=class r extends Bi{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new r(t.radius,t.detail)}},na=class r extends Bi{constructor(t=1,e=0){let n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new r(t.radius,t.detail)}},Rl=class r extends Rt{constructor(t=.5,e=1,n=32,i=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:i,thetaStart:s,thetaLength:o},n=Math.max(3,n),i=Math.max(1,i);let a=[],c=[],l=[],h=[],f=t,u=(e-t)/i,d=new R,g=new X;for(let x=0;x<=i;x++){for(let p=0;p<=n;p++){let m=s+p/n*o;d.x=f*Math.cos(m),d.y=f*Math.sin(m),c.push(d.x,d.y,d.z),l.push(0,0,1),g.x=(d.x/e+1)/2,g.y=(d.y/e+1)/2,h.push(g.x,g.y)}f+=u}for(let x=0;x<i;x++){let p=x*(n+1);for(let m=0;m<n;m++){let _=m+p,v=_,y=_+n+1,w=_+n+2,S=_+1;a.push(v,y,S),a.push(y,w,S)}}this.setIndex(a),this.setAttribute("position",new yt(c,3)),this.setAttribute("normal",new yt(l,3)),this.setAttribute("uv",new yt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Cl=class r extends Rt{constructor(t=new fi([new X(0,.5),new X(-.5,-.5),new X(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],i=[],s=[],o=[],a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new yt(i,3)),this.setAttribute("normal",new yt(s,3)),this.setAttribute("uv",new yt(o,2));function l(h){let f=i.length/3,u=h.extractPoints(e),d=u.shape,g=u.holes;Kn.isClockWise(d)===!1&&(d=d.reverse());for(let p=0,m=g.length;p<m;p++){let _=g[p];Kn.isClockWise(_)===!0&&(g[p]=_.reverse())}let x=Kn.triangulateShape(d,g);for(let p=0,m=g.length;p<m;p++){let _=g[p];d=d.concat(_)}for(let p=0,m=d.length;p<m;p++){let _=d[p];i.push(_.x,_.y,0),s.push(0,0,1),o.push(_.x,_.y)}for(let p=0,m=x.length;p<m;p++){let _=x[p],v=_[0]+f,y=_[1]+f,w=_[2]+f;n.push(v,y,w),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return aw(e,t)}static fromJSON(t,e){let n=[];for(let i=0,s=t.shapes.length;i<s;i++){let o=e[t.shapes[i]];n.push(o)}return new r(n,t.curveSegments)}};function aw(r,t){if(t.shapes=[],Array.isArray(r))for(let e=0,n=r.length;e<n;e++){let i=r[e];t.shapes.push(i.uuid)}else t.shapes.push(r.uuid);return t}var ia=class r extends Rt{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(o+a,Math.PI),l=0,h=[],f=new R,u=new R,d=[],g=[],x=[],p=[];for(let m=0;m<=n;m++){let _=[],v=m/n,y=0;m===0&&o===0?y=.5/e:m===n&&c===Math.PI&&(y=-.5/e);for(let w=0;w<=e;w++){let S=w/e;f.x=-t*Math.cos(i+S*s)*Math.sin(o+v*a),f.y=t*Math.cos(o+v*a),f.z=t*Math.sin(i+S*s)*Math.sin(o+v*a),g.push(f.x,f.y,f.z),u.copy(f).normalize(),x.push(u.x,u.y,u.z),p.push(S+y,1-v),_.push(l++)}h.push(_)}for(let m=0;m<n;m++)for(let _=0;_<e;_++){let v=h[m][_+1],y=h[m][_],w=h[m+1][_],S=h[m+1][_+1];(m!==0||o>0)&&d.push(v,y,S),(m!==n-1||c<Math.PI)&&d.push(y,w,S)}this.setIndex(d),this.setAttribute("position",new yt(g,3)),this.setAttribute("normal",new yt(x,3)),this.setAttribute("uv",new yt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}},Il=class r extends Bi{constructor(t=1,e=0){let n=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],i=[2,1,0,0,3,2,1,3,0,2,3,1];super(n,i,t,e),this.type="TetrahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new r(t.radius,t.detail)}},Pl=class r extends Rt{constructor(t=1,e=.4,n=12,i=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:s},n=Math.floor(n),i=Math.floor(i);let o=[],a=[],c=[],l=[],h=new R,f=new R,u=new R;for(let d=0;d<=n;d++)for(let g=0;g<=i;g++){let x=g/i*s,p=d/n*Math.PI*2;f.x=(t+e*Math.cos(p))*Math.cos(x),f.y=(t+e*Math.cos(p))*Math.sin(x),f.z=e*Math.sin(p),a.push(f.x,f.y,f.z),h.x=t*Math.cos(x),h.y=t*Math.sin(x),u.subVectors(f,h).normalize(),c.push(u.x,u.y,u.z),l.push(g/i),l.push(d/n)}for(let d=1;d<=n;d++)for(let g=1;g<=i;g++){let x=(i+1)*d+g-1,p=(i+1)*(d-1)+g-1,m=(i+1)*(d-1)+g,_=(i+1)*d+g;o.push(x,p,_),o.push(p,m,_)}this.setIndex(o),this.setAttribute("position",new yt(a,3)),this.setAttribute("normal",new yt(c,3)),this.setAttribute("uv",new yt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}},Dl=class r extends Rt{constructor(t=1,e=.4,n=64,i=8,s=2,o=3){super(),this.type="TorusKnotGeometry",this.parameters={radius:t,tube:e,tubularSegments:n,radialSegments:i,p:s,q:o},n=Math.floor(n),i=Math.floor(i);let a=[],c=[],l=[],h=[],f=new R,u=new R,d=new R,g=new R,x=new R,p=new R,m=new R;for(let v=0;v<=n;++v){let y=v/n*s*Math.PI*2;_(y,s,o,t,d),_(y+.01,s,o,t,g),p.subVectors(g,d),m.addVectors(g,d),x.crossVectors(p,m),m.crossVectors(x,p),x.normalize(),m.normalize();for(let w=0;w<=i;++w){let S=w/i*Math.PI*2,T=-e*Math.cos(S),A=e*Math.sin(S);f.x=d.x+(T*m.x+A*x.x),f.y=d.y+(T*m.y+A*x.y),f.z=d.z+(T*m.z+A*x.z),c.push(f.x,f.y,f.z),u.subVectors(f,d).normalize(),l.push(u.x,u.y,u.z),h.push(v/n),h.push(w/i)}}for(let v=1;v<=n;v++)for(let y=1;y<=i;y++){let w=(i+1)*(v-1)+(y-1),S=(i+1)*v+(y-1),T=(i+1)*v+y,A=(i+1)*(v-1)+y;a.push(w,S,A),a.push(S,T,A)}this.setIndex(a),this.setAttribute("position",new yt(c,3)),this.setAttribute("normal",new yt(l,3)),this.setAttribute("uv",new yt(h,2));function _(v,y,w,S,T){let A=Math.cos(v),M=Math.sin(v),b=w/y*v,I=Math.cos(b);T.x=S*(2+I)*.5*A,T.y=S*(2+I)*M*.5,T.z=S*Math.sin(b)*.5}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new r(t.radius,t.tube,t.tubularSegments,t.radialSegments,t.p,t.q)}},Ll=class r extends Rt{constructor(t=new Jo(new R(-1,-1,0),new R(-1,1,0),new R(1,1,0)),e=64,n=1,i=8,s=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:s};let o=t.computeFrenetFrames(e,s);this.tangents=o.tangents,this.normals=o.normals,this.binormals=o.binormals;let a=new R,c=new R,l=new X,h=new R,f=[],u=[],d=[],g=[];x(),this.setIndex(g),this.setAttribute("position",new yt(f,3)),this.setAttribute("normal",new yt(u,3)),this.setAttribute("uv",new yt(d,2));function x(){for(let v=0;v<e;v++)p(v);p(s===!1?e:0),_(),m()}function p(v){h=t.getPointAt(v/e,h);let y=o.normals[v],w=o.binormals[v];for(let S=0;S<=i;S++){let T=S/i*Math.PI*2,A=Math.sin(T),M=-Math.cos(T);c.x=M*y.x+A*w.x,c.y=M*y.y+A*w.y,c.z=M*y.z+A*w.z,c.normalize(),u.push(c.x,c.y,c.z),a.x=h.x+n*c.x,a.y=h.y+n*c.y,a.z=h.z+n*c.z,f.push(a.x,a.y,a.z)}}function m(){for(let v=1;v<=e;v++)for(let y=1;y<=i;y++){let w=(i+1)*(v-1)+(y-1),S=(i+1)*v+(y-1),T=(i+1)*v+y,A=(i+1)*(v-1)+y;g.push(w,S,A),g.push(S,T,A)}}function _(){for(let v=0;v<=e;v++)for(let y=0;y<=i;y++)l.x=v/e,l.y=y/i,d.push(l.x,l.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new r(new _l[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}},Fl=class extends Rt{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],n=new Set,i=new R,s=new R;if(t.index!==null){let o=t.attributes.position,a=t.index,c=t.groups;c.length===0&&(c=[{start:0,count:a.count,materialIndex:0}]);for(let l=0,h=c.length;l<h;++l){let f=c[l],u=f.start,d=f.count;for(let g=u,x=u+d;g<x;g+=3)for(let p=0;p<3;p++){let m=a.getX(g+p),_=a.getX(g+(p+1)%3);i.fromBufferAttribute(o,m),s.fromBufferAttribute(o,_),tg(i,s,n)===!0&&(e.push(i.x,i.y,i.z),e.push(s.x,s.y,s.z))}}}else{let o=t.attributes.position;for(let a=0,c=o.count/3;a<c;a++)for(let l=0;l<3;l++){let h=3*a+l,f=3*a+(l+1)%3;i.fromBufferAttribute(o,h),s.fromBufferAttribute(o,f),tg(i,s,n)===!0&&(e.push(i.x,i.y,i.z),e.push(s.x,s.y,s.z))}}this.setAttribute("position",new yt(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function tg(r,t,e){let n=`${r.x},${r.y},${r.z}-${t.x},${t.y},${t.z}`,i=`${t.x},${t.y},${t.z}-${r.x},${r.y},${r.z}`;return e.has(n)===!0||e.has(i)===!0?!1:(e.add(n),e.add(i),!0)}var eg=Object.freeze({__proto__:null,BoxGeometry:pi,CapsuleGeometry:bl,CircleGeometry:Ml,ConeGeometry:Sl,CylinderGeometry:_s,DodecahedronGeometry:Tl,EdgesGeometry:wl,ExtrudeGeometry:Al,IcosahedronGeometry:El,LatheGeometry:Qo,OctahedronGeometry:na,PlaneGeometry:ms,PolyhedronGeometry:Bi,RingGeometry:Rl,ShapeGeometry:Cl,SphereGeometry:ia,TetrahedronGeometry:Il,TorusGeometry:Pl,TorusKnotGeometry:Dl,TubeGeometry:Ll,WireframeGeometry:Fl}),Nl=class extends We{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new at(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}},Ul=class extends Pe{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},jn=class extends We{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new at(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Bl=class extends jn{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new X(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ae(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new at(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new at(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new at(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}},Ol=class extends We{constructor(t){super(),this.isMeshPhongMaterial=!0,this.type="MeshPhongMaterial",this.color=new at(16777215),this.specular=new at(1118481),this.shininess=30,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=fa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.specular.copy(t.specular),this.shininess=t.shininess,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},zl=class extends We{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new at(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},kl=class extends We{constructor(t){super(),this.isMeshNormalMaterial=!0,this.type="MeshNormalMaterial",this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.flatShading=!1,this.setValues(t)}copy(t){return super.copy(t),this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.flatShading=t.flatShading,this}},Vl=class extends We{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new at(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Sn,this.combine=fa,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Hl=class extends We{constructor(t){super(),this.isMeshMatcapMaterial=!0,this.defines={MATCAP:""},this.type="MeshMatcapMaterial",this.color=new at(16777215),this.matcap=null,this.map=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vi,this.normalScale=new X(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={MATCAP:""},this.color.copy(t.color),this.matcap=t.matcap,this.map=t.map,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.flatShading=t.flatShading,this.fog=t.fog,this}},Gl=class extends Ze{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}};function fr(r,t,e){return!r||!e&&r.constructor===t?r:typeof t.BYTES_PER_ELEMENT=="number"?new t(r):Array.prototype.slice.call(r)}function F0(r){return ArrayBuffer.isView(r)&&!(r instanceof DataView)}function N0(r){function t(i,s){return r[i]-r[s]}let e=r.length,n=new Array(e);for(let i=0;i!==e;++i)n[i]=i;return n.sort(t),n}function Hf(r,t,e){let n=r.length,i=new r.constructor(n);for(let s=0,o=0;o!==n;++s){let a=e[s]*t;for(let c=0;c!==t;++c)i[o++]=r[a+c]}return i}function Xd(r,t,e,n){let i=1,s=r[0];for(;s!==void 0&&s[n]===void 0;)s=r[i++];if(s===void 0)return;let o=s[n];if(o!==void 0)if(Array.isArray(o))do o=s[n],o!==void 0&&(t.push(s.time),e.push.apply(e,o)),s=r[i++];while(s!==void 0);else if(o.toArray!==void 0)do o=s[n],o!==void 0&&(t.push(s.time),o.toArray(e,e.length)),s=r[i++];while(s!==void 0);else do o=s[n],o!==void 0&&(t.push(s.time),e.push(o)),s=r[i++];while(s!==void 0)}function cw(r,t,e,n,i=30){let s=r.clone();s.name=t;let o=[];for(let c=0;c<s.tracks.length;++c){let l=s.tracks[c],h=l.getValueSize(),f=[],u=[];for(let d=0;d<l.times.length;++d){let g=l.times[d]*i;if(!(g<e||g>=n)){f.push(l.times[d]);for(let x=0;x<h;++x)u.push(l.values[d*h+x])}}f.length!==0&&(l.times=fr(f,l.times.constructor),l.values=fr(u,l.values.constructor),o.push(l))}s.tracks=o;let a=1/0;for(let c=0;c<s.tracks.length;++c)a>s.tracks[c].times[0]&&(a=s.tracks[c].times[0]);for(let c=0;c<s.tracks.length;++c)s.tracks[c].shift(-1*a);return s.resetDuration(),s}function lw(r,t=0,e=r,n=30){n<=0&&(n=30);let i=e.tracks.length,s=t/n;for(let o=0;o<i;++o){let a=e.tracks[o],c=a.ValueTypeName;if(c==="bool"||c==="string")continue;let l=r.tracks.find(function(m){return m.name===a.name&&m.ValueTypeName===c});if(l===void 0)continue;let h=0,f=a.getValueSize();a.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(h=f/3);let u=0,d=l.getValueSize();l.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline&&(u=d/3);let g=a.times.length-1,x;if(s<=a.times[0]){let m=h,_=f-h;x=a.values.slice(m,_)}else if(s>=a.times[g]){let m=g*f+h,_=m+f-h;x=a.values.slice(m,_)}else{let m=a.createInterpolant(),_=h,v=f-h;m.evaluate(s),x=m.resultBuffer.slice(_,v)}c==="quaternion"&&new Ge().fromArray(x).normalize().conjugate().toArray(x);let p=l.times.length;for(let m=0;m<p;++m){let _=m*d+u;if(c==="quaternion")Ge.multiplyQuaternionsFlat(l.values,_,x,0,l.values,_);else{let v=d-u*2;for(let y=0;y<v;++y)l.values[_+y]-=x[y]}}}return r.blendMode=zd,r}var uw={convertArray:fr,isTypedArray:F0,getKeyframeOrder:N0,sortedArray:Hf,flattenJSON:Xd,subclip:cw,makeClipAdditive:lw},Sr=class{constructor(t,e,n,i){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,i=e[n],s=e[n-1];t:{e:{let o;n:{i:if(!(t<i)){for(let a=n+2;;){if(i===void 0){if(t<s)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=e[++n],t<i)break e}o=e.length;break n}if(!(t>=s)){let a=e[1];t<a&&(n=2,s=a);for(let c=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(i=s,s=e[--n-1],t>=s)break e}o=n,n=0;break n}break t}for(;n<o;){let a=n+o>>>1;t<e[a]?o=a:n=a+1}if(i=e[n],s=e[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,t,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=t*i;for(let o=0;o!==i;++o)e[o]=n[s+o];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},Wl=class extends Sr{constructor(t,e,n,i){super(t,e,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:ur,endingEnd:ur}}intervalChanged_(t,e,n){let i=this.parameterPositions,s=t-2,o=t+1,a=i[s],c=i[o];if(a===void 0)switch(this.getSettings_().endingStart){case hr:s=t,a=2*e-n;break;case Io:s=i.length-2,a=e+i[s]-i[s+1];break;default:s=t,a=n}if(c===void 0)switch(this.getSettings_().endingEnd){case hr:o=t,c=2*n-e;break;case Io:o=1,c=n+i[1]-i[0];break;default:o=t-1,c=e}let l=(n-e)*.5,h=this.valueSize;this._weightPrev=l/(e-a),this._weightNext=l/(c-n),this._offsetPrev=s*h,this._offsetNext=o*h}interpolate_(t,e,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,g=(n-e)/(i-e),x=g*g,p=x*g,m=-u*p+2*u*x-u*g,_=(1+u)*p+(-1.5-2*u)*x+(-.5+u)*g+1,v=(-1-d)*p+(1.5+d)*x+.5*g,y=d*p-d*x;for(let w=0;w!==a;++w)s[w]=m*o[h+w]+_*o[l+w]+v*o[c+w]+y*o[f+w];return s}},ra=class extends Sr{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=t*a,l=c-a,h=(n-e)/(i-e),f=1-h;for(let u=0;u!==a;++u)s[u]=o[l+u]*f+o[c+u]*h;return s}},Xl=class extends Sr{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t){return this.copySampleValue_(t-1)}},wn=class{constructor(t,e,n,i){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=fr(e,this.TimeBufferType),this.values=fr(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:fr(t.times,Array),values:fr(t.values,Array)};let i=t.getInterpolation();i!==t.DefaultInterpolation&&(n.interpolation=i)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new Xl(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ra(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Wl(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Co:e=this.InterpolantFactoryMethodDiscrete;break;case Kc:e=this.InterpolantFactoryMethodLinear;break;case Mc:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Co;case this.InterpolantFactoryMethodLinear:return Kc;case this.InterpolantFactoryMethodSmooth:return Mc}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,i=e.length;n!==i;++n)e[n]*=t}return this}trim(t,e){let n=this.times,i=n.length,s=0,o=i-1;for(;s!==i&&n[s]<t;)++s;for(;o!==-1&&n[o]>e;)--o;if(++o,s!==0||o!==i){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=n.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,i=this.values,s=n.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let o=null;for(let a=0;a!==s;a++){let c=n[a];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,a,c),t=!1;break}if(o!==null&&o>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,a,c,o),t=!1;break}o=c}if(i!==void 0&&F0(i))for(let a=0,c=i.length;a!==c;++a){let l=i[a];if(isNaN(l)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,a,l),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Mc,s=t.length-1,o=1;for(let a=1;a<s;++a){let c=!1,l=t[a],h=t[a+1];if(l!==h&&(a!==1||l!==t[0]))if(i)c=!0;else{let f=a*n,u=f-n,d=f+n;for(let g=0;g!==n;++g){let x=e[f+g];if(x!==e[u+g]||x!==e[d+g]){c=!0;break}}}if(c){if(a!==o){t[o]=t[a];let f=a*n,u=o*n;for(let d=0;d!==n;++d)e[u+d]=e[f+d]}++o}}if(s>0){t[o]=t[s];for(let a=s*n,c=o*n,l=0;l!==n;++l)e[c+l]=e[a+l];++o}return o!==t.length?(this.times=t.slice(0,o),this.values=e.slice(0,o*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,i=new n(this.name,t,e);return i.createInterpolant=this.createInterpolant,i}};wn.prototype.TimeBufferType=Float32Array;wn.prototype.ValueBufferType=Float32Array;wn.prototype.DefaultInterpolation=Kc;var mi=class extends wn{constructor(t,e,n){super(t,e,n)}};mi.prototype.ValueTypeName="bool";mi.prototype.ValueBufferType=Array;mi.prototype.DefaultInterpolation=Co;mi.prototype.InterpolantFactoryMethodLinear=void 0;mi.prototype.InterpolantFactoryMethodSmooth=void 0;var sa=class extends wn{};sa.prototype.ValueTypeName="color";var Tr=class extends wn{};Tr.prototype.ValueTypeName="number";var ql=class extends Sr{constructor(t,e,n,i){super(t,e,n,i)}interpolate_(t,e,n,i){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,c=(n-e)/(i-e),l=t*a;for(let h=l+a;l!==h;l+=4)Ge.slerpFlat(s,0,o,l-a,o,l,c);return s}},wr=class extends wn{InterpolantFactoryMethodLinear(t){return new ql(this.times,this.values,this.getValueSize(),t)}};wr.prototype.ValueTypeName="quaternion";wr.prototype.InterpolantFactoryMethodSmooth=void 0;var gi=class extends wn{constructor(t,e,n){super(t,e,n)}};gi.prototype.ValueTypeName="string";gi.prototype.ValueBufferType=Array;gi.prototype.DefaultInterpolation=Co;gi.prototype.InterpolantFactoryMethodLinear=void 0;gi.prototype.InterpolantFactoryMethodSmooth=void 0;var Ar=class extends wn{};Ar.prototype.ValueTypeName="vector";var Er=class{constructor(t="",e=-1,n=[],i=au){this.name=t,this.tracks=n,this.duration=e,this.blendMode=i,this.uuid=Mn(),this.duration<0&&this.resetDuration()}static parse(t){let e=[],n=t.tracks,i=1/(t.fps||1);for(let o=0,a=n.length;o!==a;++o)e.push(fw(n[o]).scale(i));let s=new this(t.name,t.duration,e,t.blendMode);return s.uuid=t.uuid,s}static toJSON(t){let e=[],n=t.tracks,i={name:t.name,duration:t.duration,tracks:e,uuid:t.uuid,blendMode:t.blendMode};for(let s=0,o=n.length;s!==o;++s)e.push(wn.toJSON(n[s]));return i}static CreateFromMorphTargetSequence(t,e,n,i){let s=e.length,o=[];for(let a=0;a<s;a++){let c=[],l=[];c.push((a+s-1)%s,a,(a+1)%s),l.push(0,1,0);let h=N0(c);c=Hf(c,1,h),l=Hf(l,1,h),!i&&c[0]===0&&(c.push(s),l.push(l[0])),o.push(new Tr(".morphTargetInfluences["+e[a].name+"]",c,l).scale(1/n))}return new this(t,-1,o)}static findByName(t,e){let n=t;if(!Array.isArray(t)){let i=t;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===e)return n[i];return null}static CreateClipsFromMorphTargetSequences(t,e,n){let i={},s=/^([\w-]*?)([\d]+)$/;for(let a=0,c=t.length;a<c;a++){let l=t[a],h=l.name.match(s);if(h&&h.length>1){let f=h[1],u=i[f];u||(i[f]=u=[]),u.push(l)}}let o=[];for(let a in i)o.push(this.CreateFromMorphTargetSequence(a,i[a],e,n));return o}static parseAnimation(t,e){if(!t)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(f,u,d,g,x){if(d.length!==0){let p=[],m=[];Xd(d,p,m,g),p.length!==0&&x.push(new f(u,p,m))}},i=[],s=t.name||"default",o=t.fps||30,a=t.blendMode,c=t.length||-1,l=t.hierarchy||[];for(let f=0;f<l.length;f++){let u=l[f].keys;if(!(!u||u.length===0))if(u[0].morphTargets){let d={},g;for(g=0;g<u.length;g++)if(u[g].morphTargets)for(let x=0;x<u[g].morphTargets.length;x++)d[u[g].morphTargets[x]]=-1;for(let x in d){let p=[],m=[];for(let _=0;_!==u[g].morphTargets.length;++_){let v=u[g];p.push(v.time),m.push(v.morphTarget===x?1:0)}i.push(new Tr(".morphTargetInfluence["+x+"]",p,m))}c=d.length*o}else{let d=".bones["+e[f].name+"]";n(Ar,d+".position",u,"pos",i),n(wr,d+".quaternion",u,"rot",i),n(Ar,d+".scale",u,"scl",i)}}return i.length===0?null:new this(s,c,i,a)}resetDuration(){let t=this.tracks,e=0;for(let n=0,i=t.length;n!==i;++n){let s=this.tracks[n];e=Math.max(e,s.times[s.times.length-1])}return this.duration=e,this}trim(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].trim(0,this.duration);return this}validate(){let t=!0;for(let e=0;e<this.tracks.length;e++)t=t&&this.tracks[e].validate();return t}optimize(){for(let t=0;t<this.tracks.length;t++)this.tracks[t].optimize();return this}clone(){let t=[];for(let e=0;e<this.tracks.length;e++)t.push(this.tracks[e].clone());return new this.constructor(this.name,this.duration,t,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function hw(r){switch(r.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Tr;case"vector":case"vector2":case"vector3":case"vector4":return Ar;case"color":return sa;case"quaternion":return wr;case"bool":case"boolean":return mi;case"string":return gi}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+r)}function fw(r){if(r.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let t=hw(r.type);if(r.times===void 0){let e=[],n=[];Xd(r.keys,e,n,"value"),r.times=e,r.values=n}return t.parse!==void 0?t.parse(r):new t(r.name,r.times,r.values,r.interpolation)}var hi={enabled:!1,files:{},add:function(r,t){this.enabled!==!1&&(this.files[r]=t)},get:function(r){if(this.enabled!==!1)return this.files[r]},remove:function(r){delete this.files[r]},clear:function(){this.files={}}},oa=class{constructor(t,e,n){let i=this,s=!1,o=0,a=0,c,l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,s===!1&&i.onStart!==void 0&&i.onStart(h,o,a),s=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(s=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,f){return l.push(h,f),this},this.removeHandler=function(h){let f=l.indexOf(h);return f!==-1&&l.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=l.length;f<u;f+=2){let d=l[f],g=l[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return g}return null}}},U0=new oa,rn=class{constructor(t){this.manager=t!==void 0?t:U0,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(i,s){n.load(t,i,e,s)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};rn.DEFAULT_MATERIAL_NAME="__DEFAULT";var ci={},Gf=class extends Error{constructor(t,e){super(t),this.response=e}},Hn=class extends rn{constructor(t){super(t)}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let s=hi.get(t);if(s!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(s),this.manager.itemEnd(t)},0),s;if(ci[t]!==void 0){ci[t].push({onLoad:e,onProgress:n,onError:i});return}ci[t]=[],ci[t].push({onLoad:e,onProgress:n,onError:i});let o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let h=ci[t],f=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),d=u?parseInt(u):0,g=d!==0,x=0,p=new ReadableStream({start(m){_();function _(){f.read().then(({done:v,value:y})=>{if(v)m.close();else{x+=y.byteLength;let w=new ProgressEvent("progress",{lengthComputable:g,loaded:x,total:d});for(let S=0,T=h.length;S<T;S++){let A=h[S];A.onProgress&&A.onProgress(w)}m.enqueue(y),_()}},v=>{m.error(v)})}}});return new Response(p)}else throw new Gf(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{let f=/charset="?([^;"\s]*)"?/i.exec(a),u=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(u);return l.arrayBuffer().then(g=>d.decode(g))}}}).then(l=>{hi.add(t,l);let h=ci[t];delete ci[t];for(let f=0,u=h.length;f<u;f++){let d=h[f];d.onLoad&&d.onLoad(l)}}).catch(l=>{let h=ci[t];if(h===void 0)throw this.manager.itemError(t),l;delete ci[t];for(let f=0,u=h.length;f<u;f++){let d=h[f];d.onError&&d.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}},Wf=class extends rn{constructor(t){super(t)}load(t,e,n,i){let s=this,o=new Hn(this.manager);o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(a){try{e(s.parse(JSON.parse(a)))}catch(c){i?i(c):console.error(c),s.manager.itemError(t)}},n,i)}parse(t){let e=[];for(let n=0;n<t.length;n++){let i=Er.parse(t[n]);e.push(i)}return e}},Xf=class extends rn{constructor(t){super(t)}load(t,e,n,i){let s=this,o=[],a=new xs,c=new Hn(this.manager);c.setPath(this.path),c.setResponseType("arraybuffer"),c.setRequestHeader(this.requestHeader),c.setWithCredentials(s.withCredentials);let l=0;function h(f){c.load(t[f],function(u){let d=s.parse(u,!0);o[f]={width:d.width,height:d.height,format:d.format,mipmaps:d.mipmaps},l+=1,l===6&&(d.mipmapCount===1&&(a.minFilter=Qt),a.image=o,a.format=d.format,a.needsUpdate=!0,e&&e(a))},n,i)}if(Array.isArray(t))for(let f=0,u=t.length;f<u;++f)h(f);else c.load(t,function(f){let u=s.parse(f,!0);if(u.isCubemap){let d=u.mipmaps.length/u.mipmapCount;for(let g=0;g<d;g++){o[g]={mipmaps:[]};for(let x=0;x<u.mipmapCount;x++)o[g].mipmaps.push(u.mipmaps[g*u.mipmapCount+x]),o[g].format=u.format,o[g].width=u.width,o[g].height=u.height}a.image=o}else a.image.width=u.width,a.image.height=u.height,a.mipmaps=u.mipmaps;u.mipmapCount===1&&(a.minFilter=Qt),a.format=u.format,a.needsUpdate=!0,e&&e(a)},n,i);return a}},Rr=class extends rn{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let s=this,o=hi.get(t);if(o!==void 0)return s.manager.itemStart(t),setTimeout(function(){e&&e(o),s.manager.itemEnd(t)},0),o;let a=Uo("img");function c(){h(),hi.add(t,this),e&&e(this),s.manager.itemEnd(t)}function l(f){h(),i&&i(f),s.manager.itemError(t),s.manager.itemEnd(t)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),s.manager.itemStart(t),a.src=t,a}},qf=class extends rn{constructor(t){super(t)}load(t,e,n,i){let s=new xr;s.colorSpace=Rn;let o=new Rr(this.manager);o.setCrossOrigin(this.crossOrigin),o.setPath(this.path);let a=0;function c(l){o.load(t[l],function(h){s.images[l]=h,a++,a===6&&(s.needsUpdate=!0,e&&e(s))},void 0,i)}for(let l=0;l<t.length;++l)c(l);return s}},aa=class extends rn{constructor(t){super(t)}load(t,e,n,i){let s=this,o=new jt,a=new Hn(this.manager);return a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(s.withCredentials),a.load(t,function(c){let l;try{l=s.parse(c)}catch(h){if(i!==void 0)i(h);else{console.error(h);return}}l.image!==void 0?o.image=l.image:l.data!==void 0&&(o.image.width=l.width,o.image.height=l.height,o.image.data=l.data),o.wrapS=l.wrapS!==void 0?l.wrapS:ge,o.wrapT=l.wrapT!==void 0?l.wrapT:ge,o.magFilter=l.magFilter!==void 0?l.magFilter:Qt,o.minFilter=l.minFilter!==void 0?l.minFilter:Qt,o.anisotropy=l.anisotropy!==void 0?l.anisotropy:1,l.colorSpace!==void 0&&(o.colorSpace=l.colorSpace),l.flipY!==void 0&&(o.flipY=l.flipY),l.format!==void 0&&(o.format=l.format),l.type!==void 0&&(o.type=l.type),l.mipmaps!==void 0&&(o.mipmaps=l.mipmaps,o.minFilter=Zn),l.mipmapCount===1&&(o.minFilter=Qt),l.generateMipmaps!==void 0&&(o.generateMipmaps=l.generateMipmaps),o.needsUpdate=!0,e&&e(o,l)},n,i),o}},Yf=class extends rn{constructor(t){super(t)}load(t,e,n,i){let s=new Be,o=new Rr(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){s.image=a,s.needsUpdate=!0,e!==void 0&&e(s)},n,i),s}},ti=class extends oe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new at(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(e.object.target=this.target.uuid),e}},Yl=class extends ti{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new at(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},of=new dt,ng=new R,ig=new R,ca=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new X(512,512),this.map=null,this.mapPass=null,this.matrix=new dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new vr,this._frameExtents=new X(1,1),this._viewportCount=1,this._viewports=[new Kt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;ng.setFromMatrixPosition(t.matrixWorld),e.position.copy(ng),ig.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ig),e.updateMatrixWorld(),of.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(of),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(of)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},$f=class extends ca{constructor(){super(new _e(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1}updateMatrices(t){let e=this.camera,n=fs*2*t.angle*this.focus,i=this.mapSize.width/this.mapSize.height,s=t.distance||e.far;(n!==e.fov||i!==e.aspect||s!==e.far)&&(e.fov=n,e.aspect=i,e.far=s,e.updateProjectionMatrix()),super.updateMatrices(t)}copy(t){return super.copy(t),this.focus=t.focus,this}},ys=class extends ti{constructor(t,e,n=0,i=Math.PI/3,s=0,o=2){super(t,e),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.target=new oe,this.distance=n,this.angle=i,this.penumbra=s,this.decay=o,this.map=null,this.shadow=new $f}get power(){return this.intensity*Math.PI}set power(t){this.intensity=t/Math.PI}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.angle=t.angle,this.penumbra=t.penumbra,this.decay=t.decay,this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},rg=new dt,ho=new R,af=new R,Zf=class extends ca{constructor(){super(new _e(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new X(4,2),this._viewportCount=6,this._viewports=[new Kt(2,1,1,1),new Kt(0,1,1,1),new Kt(3,1,1,1),new Kt(1,1,1,1),new Kt(3,0,1,1),new Kt(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){let n=this.camera,i=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),ho.setFromMatrixPosition(t.matrixWorld),n.position.copy(ho),af.copy(n.position),af.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(af),n.updateMatrixWorld(),i.makeTranslation(-ho.x,-ho.y,-ho.z),rg.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(rg)}},bs=class extends ti{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Zf}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}},Jf=class extends ca{constructor(){super(new Fi(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},$l=class extends ti{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(oe.DEFAULT_UP),this.updateMatrix(),this.target=new oe,this.shadow=new Jf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}},Zl=class extends ti{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}},Ms=class extends ti{constructor(t,e,n=10,i=10){super(t,e),this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(t){this.intensity=t/(this.width*this.height*Math.PI)}copy(t){return super.copy(t),this.width=t.width,this.height=t.height,this}toJSON(t){let e=super.toJSON(t);return e.object.width=this.width,e.object.height=this.height,e}},Jl=class{constructor(){this.isSphericalHarmonics3=!0,this.coefficients=[];for(let t=0;t<9;t++)this.coefficients.push(new R)}set(t){for(let e=0;e<9;e++)this.coefficients[e].copy(t[e]);return this}zero(){for(let t=0;t<9;t++)this.coefficients[t].set(0,0,0);return this}getAt(t,e){let n=t.x,i=t.y,s=t.z,o=this.coefficients;return e.copy(o[0]).multiplyScalar(.282095),e.addScaledVector(o[1],.488603*i),e.addScaledVector(o[2],.488603*s),e.addScaledVector(o[3],.488603*n),e.addScaledVector(o[4],1.092548*(n*i)),e.addScaledVector(o[5],1.092548*(i*s)),e.addScaledVector(o[6],.315392*(3*s*s-1)),e.addScaledVector(o[7],1.092548*(n*s)),e.addScaledVector(o[8],.546274*(n*n-i*i)),e}getIrradianceAt(t,e){let n=t.x,i=t.y,s=t.z,o=this.coefficients;return e.copy(o[0]).multiplyScalar(.886227),e.addScaledVector(o[1],2*.511664*i),e.addScaledVector(o[2],2*.511664*s),e.addScaledVector(o[3],2*.511664*n),e.addScaledVector(o[4],2*.429043*n*i),e.addScaledVector(o[5],2*.429043*i*s),e.addScaledVector(o[6],.743125*s*s-.247708),e.addScaledVector(o[7],2*.429043*n*s),e.addScaledVector(o[8],.429043*(n*n-i*i)),e}add(t){for(let e=0;e<9;e++)this.coefficients[e].add(t.coefficients[e]);return this}addScaledSH(t,e){for(let n=0;n<9;n++)this.coefficients[n].addScaledVector(t.coefficients[n],e);return this}scale(t){for(let e=0;e<9;e++)this.coefficients[e].multiplyScalar(t);return this}lerp(t,e){for(let n=0;n<9;n++)this.coefficients[n].lerp(t.coefficients[n],e);return this}equals(t){for(let e=0;e<9;e++)if(!this.coefficients[e].equals(t.coefficients[e]))return!1;return!0}copy(t){return this.set(t.coefficients)}clone(){return new this.constructor().copy(this)}fromArray(t,e=0){let n=this.coefficients;for(let i=0;i<9;i++)n[i].fromArray(t,e+i*3);return this}toArray(t=[],e=0){let n=this.coefficients;for(let i=0;i<9;i++)n[i].toArray(t,e+i*3);return t}static getBasisAt(t,e){let n=t.x,i=t.y,s=t.z;e[0]=.282095,e[1]=.488603*i,e[2]=.488603*s,e[3]=.488603*n,e[4]=1.092548*n*i,e[5]=1.092548*i*s,e[6]=.315392*(3*s*s-1),e[7]=1.092548*n*s,e[8]=.546274*(n*n-i*i)}},Kl=class extends ti{constructor(t=new Jl,e=1){super(void 0,e),this.isLightProbe=!0,this.sh=t}copy(t){return super.copy(t),this.sh.copy(t.sh),this}fromJSON(t){return this.intensity=t.intensity,this.sh.fromArray(t.sh),this}toJSON(t){let e=super.toJSON(t);return e.object.sh=this.sh.toArray(),e}},Ql=class r extends rn{constructor(t){super(t),this.textures={}}load(t,e,n,i){let s=this,o=new Hn(s.manager);o.setPath(s.path),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(t,function(a){try{e(s.parse(JSON.parse(a)))}catch(c){i?i(c):console.error(c),s.manager.itemError(t)}},n,i)}parse(t){let e=this.textures;function n(s){return e[s]===void 0&&console.warn("THREE.MaterialLoader: Undefined texture",s),e[s]}let i=r.createMaterialFromType(t.type);if(t.uuid!==void 0&&(i.uuid=t.uuid),t.name!==void 0&&(i.name=t.name),t.color!==void 0&&i.color!==void 0&&i.color.setHex(t.color),t.roughness!==void 0&&(i.roughness=t.roughness),t.metalness!==void 0&&(i.metalness=t.metalness),t.sheen!==void 0&&(i.sheen=t.sheen),t.sheenColor!==void 0&&(i.sheenColor=new at().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(i.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&i.emissive!==void 0&&i.emissive.setHex(t.emissive),t.specular!==void 0&&i.specular!==void 0&&i.specular.setHex(t.specular),t.specularIntensity!==void 0&&(i.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&i.specularColor!==void 0&&i.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(i.shininess=t.shininess),t.clearcoat!==void 0&&(i.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=t.clearcoatRoughness),t.dispersion!==void 0&&(i.dispersion=t.dispersion),t.iridescence!==void 0&&(i.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(i.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=t.iridescenceThicknessRange),t.transmission!==void 0&&(i.transmission=t.transmission),t.thickness!==void 0&&(i.thickness=t.thickness),t.attenuationDistance!==void 0&&(i.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&i.attenuationColor!==void 0&&i.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(i.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(i.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(i.fog=t.fog),t.flatShading!==void 0&&(i.flatShading=t.flatShading),t.blending!==void 0&&(i.blending=t.blending),t.combine!==void 0&&(i.combine=t.combine),t.side!==void 0&&(i.side=t.side),t.shadowSide!==void 0&&(i.shadowSide=t.shadowSide),t.opacity!==void 0&&(i.opacity=t.opacity),t.transparent!==void 0&&(i.transparent=t.transparent),t.alphaTest!==void 0&&(i.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(i.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(i.depthFunc=t.depthFunc),t.depthTest!==void 0&&(i.depthTest=t.depthTest),t.depthWrite!==void 0&&(i.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(i.colorWrite=t.colorWrite),t.blendSrc!==void 0&&(i.blendSrc=t.blendSrc),t.blendDst!==void 0&&(i.blendDst=t.blendDst),t.blendEquation!==void 0&&(i.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(i.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(i.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(i.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&i.blendColor!==void 0&&i.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(i.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(i.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(i.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(i.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(i.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(i.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(i.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(i.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(i.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(i.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(i.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(i.rotation=t.rotation),t.linewidth!==void 0&&(i.linewidth=t.linewidth),t.dashSize!==void 0&&(i.dashSize=t.dashSize),t.gapSize!==void 0&&(i.gapSize=t.gapSize),t.scale!==void 0&&(i.scale=t.scale),t.polygonOffset!==void 0&&(i.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(i.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(i.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(i.dithering=t.dithering),t.alphaToCoverage!==void 0&&(i.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(i.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(i.forceSinglePass=t.forceSinglePass),t.visible!==void 0&&(i.visible=t.visible),t.toneMapped!==void 0&&(i.toneMapped=t.toneMapped),t.userData!==void 0&&(i.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?i.vertexColors=t.vertexColors>0:i.vertexColors=t.vertexColors),t.uniforms!==void 0)for(let s in t.uniforms){let o=t.uniforms[s];switch(i.uniforms[s]={},o.type){case"t":i.uniforms[s].value=n(o.value);break;case"c":i.uniforms[s].value=new at().setHex(o.value);break;case"v2":i.uniforms[s].value=new X().fromArray(o.value);break;case"v3":i.uniforms[s].value=new R().fromArray(o.value);break;case"v4":i.uniforms[s].value=new Kt().fromArray(o.value);break;case"m3":i.uniforms[s].value=new Ht().fromArray(o.value);break;case"m4":i.uniforms[s].value=new dt().fromArray(o.value);break;default:i.uniforms[s].value=o.value}}if(t.defines!==void 0&&(i.defines=t.defines),t.vertexShader!==void 0&&(i.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(i.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(i.glslVersion=t.glslVersion),t.extensions!==void 0)for(let s in t.extensions)i.extensions[s]=t.extensions[s];if(t.lights!==void 0&&(i.lights=t.lights),t.clipping!==void 0&&(i.clipping=t.clipping),t.size!==void 0&&(i.size=t.size),t.sizeAttenuation!==void 0&&(i.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(i.map=n(t.map)),t.matcap!==void 0&&(i.matcap=n(t.matcap)),t.alphaMap!==void 0&&(i.alphaMap=n(t.alphaMap)),t.bumpMap!==void 0&&(i.bumpMap=n(t.bumpMap)),t.bumpScale!==void 0&&(i.bumpScale=t.bumpScale),t.normalMap!==void 0&&(i.normalMap=n(t.normalMap)),t.normalMapType!==void 0&&(i.normalMapType=t.normalMapType),t.normalScale!==void 0){let s=t.normalScale;Array.isArray(s)===!1&&(s=[s,s]),i.normalScale=new X().fromArray(s)}return t.displacementMap!==void 0&&(i.displacementMap=n(t.displacementMap)),t.displacementScale!==void 0&&(i.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(i.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(i.roughnessMap=n(t.roughnessMap)),t.metalnessMap!==void 0&&(i.metalnessMap=n(t.metalnessMap)),t.emissiveMap!==void 0&&(i.emissiveMap=n(t.emissiveMap)),t.emissiveIntensity!==void 0&&(i.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(i.specularMap=n(t.specularMap)),t.specularIntensityMap!==void 0&&(i.specularIntensityMap=n(t.specularIntensityMap)),t.specularColorMap!==void 0&&(i.specularColorMap=n(t.specularColorMap)),t.envMap!==void 0&&(i.envMap=n(t.envMap)),t.envMapRotation!==void 0&&i.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(i.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(i.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(i.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(i.lightMap=n(t.lightMap)),t.lightMapIntensity!==void 0&&(i.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(i.aoMap=n(t.aoMap)),t.aoMapIntensity!==void 0&&(i.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(i.gradientMap=n(t.gradientMap)),t.clearcoatMap!==void 0&&(i.clearcoatMap=n(t.clearcoatMap)),t.clearcoatRoughnessMap!==void 0&&(i.clearcoatRoughnessMap=n(t.clearcoatRoughnessMap)),t.clearcoatNormalMap!==void 0&&(i.clearcoatNormalMap=n(t.clearcoatNormalMap)),t.clearcoatNormalScale!==void 0&&(i.clearcoatNormalScale=new X().fromArray(t.clearcoatNormalScale)),t.iridescenceMap!==void 0&&(i.iridescenceMap=n(t.iridescenceMap)),t.iridescenceThicknessMap!==void 0&&(i.iridescenceThicknessMap=n(t.iridescenceThicknessMap)),t.transmissionMap!==void 0&&(i.transmissionMap=n(t.transmissionMap)),t.thicknessMap!==void 0&&(i.thicknessMap=n(t.thicknessMap)),t.anisotropyMap!==void 0&&(i.anisotropyMap=n(t.anisotropyMap)),t.sheenColorMap!==void 0&&(i.sheenColorMap=n(t.sheenColorMap)),t.sheenRoughnessMap!==void 0&&(i.sheenRoughnessMap=n(t.sheenRoughnessMap)),i}setTextures(t){return this.textures=t,this}static createMaterialFromType(t){let e={ShadowMaterial:Nl,SpriteMaterial:Wo,RawShaderMaterial:Ul,ShaderMaterial:Pe,PointsMaterial:qo,MeshPhysicalMaterial:Bl,MeshStandardMaterial:jn,MeshPhongMaterial:Ol,MeshToonMaterial:zl,MeshNormalMaterial:kl,MeshLambertMaterial:Vl,MeshDepthMaterial:Ho,MeshDistanceMaterial:Go,MeshBasicMaterial:mn,MeshMatcapMaterial:Hl,LineDashedMaterial:Gl,LineBasicMaterial:Ze,Material:We};return new e[t]}},la=class{static decodeText(t){if(console.warn("THREE.LoaderUtils: decodeText() has been deprecated with r165 and will be removed with r175. Use TextDecoder instead."),typeof TextDecoder<"u")return new TextDecoder().decode(t);let e="";for(let n=0,i=t.length;n<i;n++)e+=String.fromCharCode(t[n]);try{return decodeURIComponent(escape(e))}catch{return e}}static extractUrlBase(t){let e=t.lastIndexOf("/");return e===-1?"./":t.slice(0,e+1)}static resolveURL(t,e){return typeof t!="string"||t===""?"":(/^https?:\/\//i.test(e)&&/^\//.test(t)&&(e=e.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(t)||/^data:.*,.*$/i.test(t)||/^blob:.*$/i.test(t)?t:e+t)}},jl=class extends Rt{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}},tu=class extends rn{constructor(t){super(t)}load(t,e,n,i){let s=this,o=new Hn(s.manager);o.setPath(s.path),o.setRequestHeader(s.requestHeader),o.setWithCredentials(s.withCredentials),o.load(t,function(a){try{e(s.parse(JSON.parse(a)))}catch(c){i?i(c):console.error(c),s.manager.itemError(t)}},n,i)}parse(t){let e={},n={};function i(d,g){if(e[g]!==void 0)return e[g];let p=d.interleavedBuffers[g],m=s(d,p.buffer),_=as(p.type,m),v=new gs(_,p.stride);return v.uuid=p.uuid,e[g]=v,v}function s(d,g){if(n[g]!==void 0)return n[g];let p=d.arrayBuffers[g],m=new Uint32Array(p).buffer;return n[g]=m,m}let o=t.isInstancedBufferGeometry?new jl:new Rt,a=t.data.index;if(a!==void 0){let d=as(a.type,a.array);o.setIndex(new Ft(d,1))}let c=t.data.attributes;for(let d in c){let g=c[d],x;if(g.isInterleavedBufferAttribute){let p=i(t.data,g.data);x=new yr(p,g.itemSize,g.offset,g.normalized)}else{let p=as(g.type,g.array),m=g.isInstancedBufferAttribute?Ui:Ft;x=new m(p,g.itemSize,g.normalized)}g.name!==void 0&&(x.name=g.name),g.usage!==void 0&&x.setUsage(g.usage),o.setAttribute(d,x)}let l=t.data.morphAttributes;if(l)for(let d in l){let g=l[d],x=[];for(let p=0,m=g.length;p<m;p++){let _=g[p],v;if(_.isInterleavedBufferAttribute){let y=i(t.data,_.data);v=new yr(y,_.itemSize,_.offset,_.normalized)}else{let y=as(_.type,_.array);v=new Ft(y,_.itemSize,_.normalized)}_.name!==void 0&&(v.name=_.name),x.push(v)}o.morphAttributes[d]=x}t.data.morphTargetsRelative&&(o.morphTargetsRelative=!0);let f=t.data.groups||t.data.drawcalls||t.data.offsets;if(f!==void 0)for(let d=0,g=f.length;d!==g;++d){let x=f[d];o.addGroup(x.start,x.count,x.materialIndex)}let u=t.data.boundingSphere;if(u!==void 0){let d=new R;u.center!==void 0&&d.fromArray(u.center),o.boundingSphere=new Ue(d,u.radius)}return t.name&&(o.name=t.name),t.userData&&(o.userData=t.userData),o}},Kf=class extends rn{constructor(t){super(t)}load(t,e,n,i){let s=this,o=this.path===""?la.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||o;let a=new Hn(this.manager);a.setPath(this.path),a.setRequestHeader(this.requestHeader),a.setWithCredentials(this.withCredentials),a.load(t,function(c){let l=null;try{l=JSON.parse(c)}catch(f){i!==void 0&&i(f),console.error("THREE:ObjectLoader: Can't parse "+t+".",f.message);return}let h=l.metadata;if(h===void 0||h.type===void 0||h.type.toLowerCase()==="geometry"){i!==void 0&&i(new Error("THREE.ObjectLoader: Can't load "+t)),console.error("THREE.ObjectLoader: Can't load "+t);return}s.parse(l,e)},n,i)}async loadAsync(t,e){let n=this,i=this.path===""?la.extractUrlBase(t):this.path;this.resourcePath=this.resourcePath||i;let s=new Hn(this.manager);s.setPath(this.path),s.setRequestHeader(this.requestHeader),s.setWithCredentials(this.withCredentials);let o=await s.loadAsync(t,e),a=JSON.parse(o),c=a.metadata;if(c===void 0||c.type===void 0||c.type.toLowerCase()==="geometry")throw new Error("THREE.ObjectLoader: Can't load "+t);return await n.parseAsync(a)}parse(t,e){let n=this.parseAnimations(t.animations),i=this.parseShapes(t.shapes),s=this.parseGeometries(t.geometries,i),o=this.parseImages(t.images,function(){e!==void 0&&e(l)}),a=this.parseTextures(t.textures,o),c=this.parseMaterials(t.materials,a),l=this.parseObject(t.object,s,c,a,n),h=this.parseSkeletons(t.skeletons,l);if(this.bindSkeletons(l,h),this.bindLightTargets(l),e!==void 0){let f=!1;for(let u in o)if(o[u].data instanceof HTMLImageElement){f=!0;break}f===!1&&e(l)}return l}async parseAsync(t){let e=this.parseAnimations(t.animations),n=this.parseShapes(t.shapes),i=this.parseGeometries(t.geometries,n),s=await this.parseImagesAsync(t.images),o=this.parseTextures(t.textures,s),a=this.parseMaterials(t.materials,o),c=this.parseObject(t.object,i,a,o,e),l=this.parseSkeletons(t.skeletons,c);return this.bindSkeletons(c,l),this.bindLightTargets(c),c}parseShapes(t){let e={};if(t!==void 0)for(let n=0,i=t.length;n<i;n++){let s=new fi().fromJSON(t[n]);e[s.uuid]=s}return e}parseSkeletons(t,e){let n={},i={};if(e.traverse(function(s){s.isBone&&(i[s.uuid]=s)}),t!==void 0)for(let s=0,o=t.length;s<o;s++){let a=new cl().fromJSON(t[s],i);n[a.uuid]=a}return n}parseGeometries(t,e){let n={};if(t!==void 0){let i=new tu;for(let s=0,o=t.length;s<o;s++){let a,c=t[s];switch(c.type){case"BufferGeometry":case"InstancedBufferGeometry":a=i.parse(c);break;default:c.type in eg?a=eg[c.type].fromJSON(c,e):console.warn(`THREE.ObjectLoader: Unsupported geometry type "${c.type}"`)}a.uuid=c.uuid,c.name!==void 0&&(a.name=c.name),c.userData!==void 0&&(a.userData=c.userData),n[c.uuid]=a}}return n}parseMaterials(t,e){let n={},i={};if(t!==void 0){let s=new Ql;s.setTextures(e);for(let o=0,a=t.length;o<a;o++){let c=t[o];n[c.uuid]===void 0&&(n[c.uuid]=s.parse(c)),i[c.uuid]=n[c.uuid]}}return i}parseAnimations(t){let e={};if(t!==void 0)for(let n=0;n<t.length;n++){let i=t[n],s=Er.parse(i);e[s.uuid]=s}return e}parseImages(t,e){let n=this,i={},s;function o(c){return n.manager.itemStart(c),s.load(c,function(){n.manager.itemEnd(c)},void 0,function(){n.manager.itemError(c),n.manager.itemEnd(c)})}function a(c){if(typeof c=="string"){let l=c,h=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(l)?l:n.resourcePath+l;return o(h)}else return c.data?{data:as(c.type,c.data),width:c.width,height:c.height}:null}if(t!==void 0&&t.length>0){let c=new oa(e);s=new Rr(c),s.setCrossOrigin(this.crossOrigin);for(let l=0,h=t.length;l<h;l++){let f=t[l],u=f.url;if(Array.isArray(u)){let d=[];for(let g=0,x=u.length;g<x;g++){let p=u[g],m=a(p);m!==null&&(m instanceof HTMLImageElement?d.push(m):d.push(new jt(m.data,m.width,m.height)))}i[f.uuid]=new Bn(d)}else{let d=a(f.url);i[f.uuid]=new Bn(d)}}}return i}async parseImagesAsync(t){let e=this,n={},i;async function s(o){if(typeof o=="string"){let a=o,c=/^(\/\/)|([a-z]+:(\/\/)?)/i.test(a)?a:e.resourcePath+a;return await i.loadAsync(c)}else return o.data?{data:as(o.type,o.data),width:o.width,height:o.height}:null}if(t!==void 0&&t.length>0){i=new Rr(this.manager),i.setCrossOrigin(this.crossOrigin);for(let o=0,a=t.length;o<a;o++){let c=t[o],l=c.url;if(Array.isArray(l)){let h=[];for(let f=0,u=l.length;f<u;f++){let d=l[f],g=await s(d);g!==null&&(g instanceof HTMLImageElement?h.push(g):h.push(new jt(g.data,g.width,g.height)))}n[c.uuid]=new Bn(h)}else{let h=await s(c.url);n[c.uuid]=new Bn(h)}}}return n}parseTextures(t,e){function n(s,o){return typeof s=="number"?s:(console.warn("THREE.ObjectLoader.parseTexture: Constant should be in numeric form.",s),o[s])}let i={};if(t!==void 0)for(let s=0,o=t.length;s<o;s++){let a=t[s];a.image===void 0&&console.warn('THREE.ObjectLoader: No "image" specified for',a.uuid),e[a.image]===void 0&&console.warn("THREE.ObjectLoader: Undefined image",a.image);let c=e[a.image],l=c.data,h;Array.isArray(l)?(h=new xr,l.length===6&&(h.needsUpdate=!0)):(l&&l.data?h=new jt:h=new Be,l&&(h.needsUpdate=!0)),h.source=c,h.uuid=a.uuid,a.name!==void 0&&(h.name=a.name),a.mapping!==void 0&&(h.mapping=n(a.mapping,dw)),a.channel!==void 0&&(h.channel=a.channel),a.offset!==void 0&&h.offset.fromArray(a.offset),a.repeat!==void 0&&h.repeat.fromArray(a.repeat),a.center!==void 0&&h.center.fromArray(a.center),a.rotation!==void 0&&(h.rotation=a.rotation),a.wrap!==void 0&&(h.wrapS=n(a.wrap[0],sg),h.wrapT=n(a.wrap[1],sg)),a.format!==void 0&&(h.format=a.format),a.internalFormat!==void 0&&(h.internalFormat=a.internalFormat),a.type!==void 0&&(h.type=a.type),a.colorSpace!==void 0&&(h.colorSpace=a.colorSpace),a.minFilter!==void 0&&(h.minFilter=n(a.minFilter,og)),a.magFilter!==void 0&&(h.magFilter=n(a.magFilter,og)),a.anisotropy!==void 0&&(h.anisotropy=a.anisotropy),a.flipY!==void 0&&(h.flipY=a.flipY),a.generateMipmaps!==void 0&&(h.generateMipmaps=a.generateMipmaps),a.premultiplyAlpha!==void 0&&(h.premultiplyAlpha=a.premultiplyAlpha),a.unpackAlignment!==void 0&&(h.unpackAlignment=a.unpackAlignment),a.compareFunction!==void 0&&(h.compareFunction=a.compareFunction),a.userData!==void 0&&(h.userData=a.userData),i[a.uuid]=h}return i}parseObject(t,e,n,i,s){let o;function a(u){return e[u]===void 0&&console.warn("THREE.ObjectLoader: Undefined geometry",u),e[u]}function c(u){if(u!==void 0){if(Array.isArray(u)){let d=[];for(let g=0,x=u.length;g<x;g++){let p=u[g];n[p]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",p),d.push(n[p])}return d}return n[u]===void 0&&console.warn("THREE.ObjectLoader: Undefined material",u),n[u]}}function l(u){return i[u]===void 0&&console.warn("THREE.ObjectLoader: Undefined texture",u),i[u]}let h,f;switch(t.type){case"Scene":o=new Ni,t.background!==void 0&&(Number.isInteger(t.background)?o.background=new at(t.background):o.background=l(t.background)),t.environment!==void 0&&(o.environment=l(t.environment)),t.fog!==void 0&&(t.fog.type==="Fog"?o.fog=new rl(t.fog.color,t.fog.near,t.fog.far):t.fog.type==="FogExp2"&&(o.fog=new il(t.fog.color,t.fog.density)),t.fog.name!==""&&(o.fog.name=t.fog.name)),t.backgroundBlurriness!==void 0&&(o.backgroundBlurriness=t.backgroundBlurriness),t.backgroundIntensity!==void 0&&(o.backgroundIntensity=t.backgroundIntensity),t.backgroundRotation!==void 0&&o.backgroundRotation.fromArray(t.backgroundRotation),t.environmentIntensity!==void 0&&(o.environmentIntensity=t.environmentIntensity),t.environmentRotation!==void 0&&o.environmentRotation.fromArray(t.environmentRotation);break;case"PerspectiveCamera":o=new _e(t.fov,t.aspect,t.near,t.far),t.focus!==void 0&&(o.focus=t.focus),t.zoom!==void 0&&(o.zoom=t.zoom),t.filmGauge!==void 0&&(o.filmGauge=t.filmGauge),t.filmOffset!==void 0&&(o.filmOffset=t.filmOffset),t.view!==void 0&&(o.view=Object.assign({},t.view));break;case"OrthographicCamera":o=new Fi(t.left,t.right,t.top,t.bottom,t.near,t.far),t.zoom!==void 0&&(o.zoom=t.zoom),t.view!==void 0&&(o.view=Object.assign({},t.view));break;case"AmbientLight":o=new Zl(t.color,t.intensity);break;case"DirectionalLight":o=new $l(t.color,t.intensity),o.target=t.target||"";break;case"PointLight":o=new bs(t.color,t.intensity,t.distance,t.decay);break;case"RectAreaLight":o=new Ms(t.color,t.intensity,t.width,t.height);break;case"SpotLight":o=new ys(t.color,t.intensity,t.distance,t.angle,t.penumbra,t.decay),o.target=t.target||"";break;case"HemisphereLight":o=new Yl(t.color,t.groundColor,t.intensity);break;case"LightProbe":o=new Kl().fromJSON(t);break;case"SkinnedMesh":h=a(t.geometry),f=c(t.material),o=new al(h,f),t.bindMode!==void 0&&(o.bindMode=t.bindMode),t.bindMatrix!==void 0&&o.bindMatrix.fromArray(t.bindMatrix),t.skeleton!==void 0&&(o.skeleton=t.skeleton);break;case"Mesh":h=a(t.geometry),f=c(t.material),o=new Zt(h,f);break;case"InstancedMesh":h=a(t.geometry),f=c(t.material);let u=t.count,d=t.instanceMatrix,g=t.instanceColor;o=new ll(h,f,u),o.instanceMatrix=new Ui(new Float32Array(d.array),16),g!==void 0&&(o.instanceColor=new Ui(new Float32Array(g.array),g.itemSize));break;case"BatchedMesh":h=a(t.geometry),f=c(t.material),o=new ul(t.maxInstanceCount,t.maxVertexCount,t.maxIndexCount,f),o.geometry=h,o.perObjectFrustumCulled=t.perObjectFrustumCulled,o.sortObjects=t.sortObjects,o._drawRanges=t.drawRanges,o._reservedRanges=t.reservedRanges,o._visibility=t.visibility,o._active=t.active,o._bounds=t.bounds.map(x=>{let p=new re;p.min.fromArray(x.boxMin),p.max.fromArray(x.boxMax);let m=new Ue;return m.radius=x.sphereRadius,m.center.fromArray(x.sphereCenter),{boxInitialized:x.boxInitialized,box:p,sphereInitialized:x.sphereInitialized,sphere:m}}),o._maxInstanceCount=t.maxInstanceCount,o._maxVertexCount=t.maxVertexCount,o._maxIndexCount=t.maxIndexCount,o._geometryInitialized=t.geometryInitialized,o._geometryCount=t.geometryCount,o._matricesTexture=l(t.matricesTexture.uuid),t.colorsTexture!==void 0&&(o._colorsTexture=l(t.colorsTexture.uuid));break;case"LOD":o=new ol;break;case"Line":o=new Qn(a(t.geometry),c(t.material));break;case"LineLoop":o=new dl(a(t.geometry),c(t.material));break;case"LineSegments":o=new Cn(a(t.geometry),c(t.material));break;case"PointCloud":case"Points":o=new pl(a(t.geometry),c(t.material));break;case"Sprite":o=new sl(c(t.material));break;case"Group":o=new Ri;break;case"Bone":o=new Xo;break;default:o=new oe}if(o.uuid=t.uuid,t.name!==void 0&&(o.name=t.name),t.matrix!==void 0?(o.matrix.fromArray(t.matrix),t.matrixAutoUpdate!==void 0&&(o.matrixAutoUpdate=t.matrixAutoUpdate),o.matrixAutoUpdate&&o.matrix.decompose(o.position,o.quaternion,o.scale)):(t.position!==void 0&&o.position.fromArray(t.position),t.rotation!==void 0&&o.rotation.fromArray(t.rotation),t.quaternion!==void 0&&o.quaternion.fromArray(t.quaternion),t.scale!==void 0&&o.scale.fromArray(t.scale)),t.up!==void 0&&o.up.fromArray(t.up),t.castShadow!==void 0&&(o.castShadow=t.castShadow),t.receiveShadow!==void 0&&(o.receiveShadow=t.receiveShadow),t.shadow&&(t.shadow.intensity!==void 0&&(o.shadow.intensity=t.shadow.intensity),t.shadow.bias!==void 0&&(o.shadow.bias=t.shadow.bias),t.shadow.normalBias!==void 0&&(o.shadow.normalBias=t.shadow.normalBias),t.shadow.radius!==void 0&&(o.shadow.radius=t.shadow.radius),t.shadow.mapSize!==void 0&&o.shadow.mapSize.fromArray(t.shadow.mapSize),t.shadow.camera!==void 0&&(o.shadow.camera=this.parseObject(t.shadow.camera))),t.visible!==void 0&&(o.visible=t.visible),t.frustumCulled!==void 0&&(o.frustumCulled=t.frustumCulled),t.renderOrder!==void 0&&(o.renderOrder=t.renderOrder),t.userData!==void 0&&(o.userData=t.userData),t.layers!==void 0&&(o.layers.mask=t.layers),t.children!==void 0){let u=t.children;for(let d=0;d<u.length;d++)o.add(this.parseObject(u[d],e,n,i,s))}if(t.animations!==void 0){let u=t.animations;for(let d=0;d<u.length;d++){let g=u[d];o.animations.push(s[g])}}if(t.type==="LOD"){t.autoUpdate!==void 0&&(o.autoUpdate=t.autoUpdate);let u=t.levels;for(let d=0;d<u.length;d++){let g=u[d],x=o.getObjectByProperty("uuid",g.object);x!==void 0&&o.addLevel(x,g.distance,g.hysteresis)}}return o}bindSkeletons(t,e){Object.keys(e).length!==0&&t.traverse(function(n){if(n.isSkinnedMesh===!0&&n.skeleton!==void 0){let i=e[n.skeleton];i===void 0?console.warn("THREE.ObjectLoader: No skeleton found with UUID:",n.skeleton):n.bind(i,n.bindMatrix)}})}bindLightTargets(t){t.traverse(function(e){if(e.isDirectionalLight||e.isSpotLight){let n=e.target,i=t.getObjectByProperty("uuid",n);i!==void 0?e.target=i:e.target=new oe}})}},dw={UVMapping:ru,CubeReflectionMapping:di,CubeRefractionMapping:Ci,EquirectangularReflectionMapping:kn,EquirectangularRefractionMapping:Eo,CubeUVReflectionMapping:ws},sg={RepeatWrapping:$e,ClampToEdgeWrapping:ge,MirroredRepeatWrapping:Ro},og={NearestFilter:Nt,NearestMipmapNearestFilter:Pd,NearestMipmapLinearFilter:os,LinearFilter:Qt,LinearMipmapNearestFilter:mo,LinearMipmapLinearFilter:Zn},Qf=class extends rn{constructor(t){super(t),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"}}setOptions(t){return this.options=t,this}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);let s=this,o=hi.get(t);if(o!==void 0){if(s.manager.itemStart(t),o.then){o.then(l=>{e&&e(l),s.manager.itemEnd(t)}).catch(l=>{i&&i(l)});return}return setTimeout(function(){e&&e(o),s.manager.itemEnd(t)},0),o}let a={};a.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",a.headers=this.requestHeader;let c=fetch(t,a).then(function(l){return l.blob()}).then(function(l){return createImageBitmap(l,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(l){return hi.add(t,l),e&&e(l),s.manager.itemEnd(t),l}).catch(function(l){i&&i(l),hi.remove(t),s.manager.itemError(t),s.manager.itemEnd(t)});hi.add(t,c),s.manager.itemStart(t)}},mc,ua=class{static getContext(){return mc===void 0&&(mc=new(window.AudioContext||window.webkitAudioContext)),mc}static setContext(t){mc=t}},jf=class extends rn{constructor(t){super(t)}load(t,e,n,i){let s=this,o=new Hn(this.manager);o.setResponseType("arraybuffer"),o.setPath(this.path),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(c){try{let l=c.slice(0);ua.getContext().decodeAudioData(l,function(f){e(f)}).catch(a)}catch(l){a(l)}},n,i);function a(c){i?i(c):console.error(c),s.manager.itemError(t)}}},ag=new dt,cg=new dt,nr=new dt,td=class{constructor(){this.type="StereoCamera",this.aspect=1,this.eyeSep=.064,this.cameraL=new _e,this.cameraL.layers.enable(1),this.cameraL.matrixAutoUpdate=!1,this.cameraR=new _e,this.cameraR.layers.enable(2),this.cameraR.matrixAutoUpdate=!1,this._cache={focus:null,fov:null,aspect:null,near:null,far:null,zoom:null,eyeSep:null}}update(t){let e=this._cache;if(e.focus!==t.focus||e.fov!==t.fov||e.aspect!==t.aspect*this.aspect||e.near!==t.near||e.far!==t.far||e.zoom!==t.zoom||e.eyeSep!==this.eyeSep){e.focus=t.focus,e.fov=t.fov,e.aspect=t.aspect*this.aspect,e.near=t.near,e.far=t.far,e.zoom=t.zoom,e.eyeSep=this.eyeSep,nr.copy(t.projectionMatrix);let i=e.eyeSep/2,s=i*e.near/e.focus,o=e.near*Math.tan(pr*e.fov*.5)/e.zoom,a,c;cg.elements[12]=-i,ag.elements[12]=i,a=-o*e.aspect+s,c=o*e.aspect+s,nr.elements[0]=2*e.near/(c-a),nr.elements[8]=(c+a)/(c-a),this.cameraL.projectionMatrix.copy(nr),a=-o*e.aspect-s,c=o*e.aspect-s,nr.elements[0]=2*e.near/(c-a),nr.elements[8]=(c+a)/(c-a),this.cameraR.projectionMatrix.copy(nr)}this.cameraL.matrixWorld.copy(t.matrixWorld).multiply(cg),this.cameraR.matrixWorld.copy(t.matrixWorld).multiply(ag)}},Ss=class{constructor(t=!0){this.autoStart=t,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=lg(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let t=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let e=lg();t=(e-this.oldTime)/1e3,this.oldTime=e,this.elapsedTime+=t}return t}};function lg(){return(typeof performance>"u"?Date:performance).now()}var ir=new R,ug=new Ge,pw=new R,rr=new R,ed=class extends oe{constructor(){super(),this.type="AudioListener",this.context=ua.getContext(),this.gain=this.context.createGain(),this.gain.connect(this.context.destination),this.filter=null,this.timeDelta=0,this._clock=new Ss}getInput(){return this.gain}removeFilter(){return this.filter!==null&&(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination),this.gain.connect(this.context.destination),this.filter=null),this}getFilter(){return this.filter}setFilter(t){return this.filter!==null?(this.gain.disconnect(this.filter),this.filter.disconnect(this.context.destination)):this.gain.disconnect(this.context.destination),this.filter=t,this.gain.connect(this.filter),this.filter.connect(this.context.destination),this}getMasterVolume(){return this.gain.gain.value}setMasterVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}updateMatrixWorld(t){super.updateMatrixWorld(t);let e=this.context.listener,n=this.up;if(this.timeDelta=this._clock.getDelta(),this.matrixWorld.decompose(ir,ug,pw),rr.set(0,0,-1).applyQuaternion(ug),e.positionX){let i=this.context.currentTime+this.timeDelta;e.positionX.linearRampToValueAtTime(ir.x,i),e.positionY.linearRampToValueAtTime(ir.y,i),e.positionZ.linearRampToValueAtTime(ir.z,i),e.forwardX.linearRampToValueAtTime(rr.x,i),e.forwardY.linearRampToValueAtTime(rr.y,i),e.forwardZ.linearRampToValueAtTime(rr.z,i),e.upX.linearRampToValueAtTime(n.x,i),e.upY.linearRampToValueAtTime(n.y,i),e.upZ.linearRampToValueAtTime(n.z,i)}else e.setPosition(ir.x,ir.y,ir.z),e.setOrientation(rr.x,rr.y,rr.z,n.x,n.y,n.z)}},eu=class extends oe{constructor(t){super(),this.type="Audio",this.listener=t,this.context=t.context,this.gain=this.context.createGain(),this.gain.connect(t.getInput()),this.autoplay=!1,this.buffer=null,this.detune=0,this.loop=!1,this.loopStart=0,this.loopEnd=0,this.offset=0,this.duration=void 0,this.playbackRate=1,this.isPlaying=!1,this.hasPlaybackControl=!0,this.source=null,this.sourceType="empty",this._startedAt=0,this._progress=0,this._connected=!1,this.filters=[]}getOutput(){return this.gain}setNodeSource(t){return this.hasPlaybackControl=!1,this.sourceType="audioNode",this.source=t,this.connect(),this}setMediaElementSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaNode",this.source=this.context.createMediaElementSource(t),this.connect(),this}setMediaStreamSource(t){return this.hasPlaybackControl=!1,this.sourceType="mediaStreamNode",this.source=this.context.createMediaStreamSource(t),this.connect(),this}setBuffer(t){return this.buffer=t,this.sourceType="buffer",this.autoplay&&this.play(),this}play(t=0){if(this.isPlaying===!0){console.warn("THREE.Audio: Audio is already playing.");return}if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}this._startedAt=this.context.currentTime+t;let e=this.context.createBufferSource();return e.buffer=this.buffer,e.loop=this.loop,e.loopStart=this.loopStart,e.loopEnd=this.loopEnd,e.onended=this.onEnded.bind(this),e.start(this._startedAt,this._progress+this.offset,this.duration),this.isPlaying=!0,this.source=e,this.setDetune(this.detune),this.setPlaybackRate(this.playbackRate),this.connect()}pause(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.isPlaying===!0&&(this._progress+=Math.max(this.context.currentTime-this._startedAt,0)*this.playbackRate,this.loop===!0&&(this._progress=this._progress%(this.duration||this.buffer.duration)),this.source.stop(),this.source.onended=null,this.isPlaying=!1),this}stop(){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this._progress=0,this.source!==null&&(this.source.stop(),this.source.onended=null),this.isPlaying=!1,this}connect(){if(this.filters.length>0){this.source.connect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].connect(this.filters[t]);this.filters[this.filters.length-1].connect(this.getOutput())}else this.source.connect(this.getOutput());return this._connected=!0,this}disconnect(){if(this._connected!==!1){if(this.filters.length>0){this.source.disconnect(this.filters[0]);for(let t=1,e=this.filters.length;t<e;t++)this.filters[t-1].disconnect(this.filters[t]);this.filters[this.filters.length-1].disconnect(this.getOutput())}else this.source.disconnect(this.getOutput());return this._connected=!1,this}}getFilters(){return this.filters}setFilters(t){return t||(t=[]),this._connected===!0?(this.disconnect(),this.filters=t.slice(),this.connect()):this.filters=t.slice(),this}setDetune(t){return this.detune=t,this.isPlaying===!0&&this.source.detune!==void 0&&this.source.detune.setTargetAtTime(this.detune,this.context.currentTime,.01),this}getDetune(){return this.detune}getFilter(){return this.getFilters()[0]}setFilter(t){return this.setFilters(t?[t]:[])}setPlaybackRate(t){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.playbackRate=t,this.isPlaying===!0&&this.source.playbackRate.setTargetAtTime(this.playbackRate,this.context.currentTime,.01),this}getPlaybackRate(){return this.playbackRate}onEnded(){this.isPlaying=!1}getLoop(){return this.hasPlaybackControl===!1?(console.warn("THREE.Audio: this Audio has no playback control."),!1):this.loop}setLoop(t){if(this.hasPlaybackControl===!1){console.warn("THREE.Audio: this Audio has no playback control.");return}return this.loop=t,this.isPlaying===!0&&(this.source.loop=this.loop),this}setLoopStart(t){return this.loopStart=t,this}setLoopEnd(t){return this.loopEnd=t,this}getVolume(){return this.gain.gain.value}setVolume(t){return this.gain.gain.setTargetAtTime(t,this.context.currentTime,.01),this}},sr=new R,hg=new Ge,mw=new R,or=new R,nd=class extends eu{constructor(t){super(t),this.panner=this.context.createPanner(),this.panner.panningModel="HRTF",this.panner.connect(this.gain)}connect(){super.connect(),this.panner.connect(this.gain)}disconnect(){super.disconnect(),this.panner.disconnect(this.gain)}getOutput(){return this.panner}getRefDistance(){return this.panner.refDistance}setRefDistance(t){return this.panner.refDistance=t,this}getRolloffFactor(){return this.panner.rolloffFactor}setRolloffFactor(t){return this.panner.rolloffFactor=t,this}getDistanceModel(){return this.panner.distanceModel}setDistanceModel(t){return this.panner.distanceModel=t,this}getMaxDistance(){return this.panner.maxDistance}setMaxDistance(t){return this.panner.maxDistance=t,this}setDirectionalCone(t,e,n){return this.panner.coneInnerAngle=t,this.panner.coneOuterAngle=e,this.panner.coneOuterGain=n,this}updateMatrixWorld(t){if(super.updateMatrixWorld(t),this.hasPlaybackControl===!0&&this.isPlaying===!1)return;this.matrixWorld.decompose(sr,hg,mw),or.set(0,0,1).applyQuaternion(hg);let e=this.panner;if(e.positionX){let n=this.context.currentTime+this.listener.timeDelta;e.positionX.linearRampToValueAtTime(sr.x,n),e.positionY.linearRampToValueAtTime(sr.y,n),e.positionZ.linearRampToValueAtTime(sr.z,n),e.orientationX.linearRampToValueAtTime(or.x,n),e.orientationY.linearRampToValueAtTime(or.y,n),e.orientationZ.linearRampToValueAtTime(or.z,n)}else e.setPosition(sr.x,sr.y,sr.z),e.setOrientation(or.x,or.y,or.z)}},id=class{constructor(t,e=2048){this.analyser=t.context.createAnalyser(),this.analyser.fftSize=e,this.data=new Uint8Array(this.analyser.frequencyBinCount),t.getOutput().connect(this.analyser)}getFrequencyData(){return this.analyser.getByteFrequencyData(this.data),this.data}getAverageFrequency(){let t=0,e=this.getFrequencyData();for(let n=0;n<e.length;n++)t+=e[n];return t/e.length}},nu=class{constructor(t,e,n){this.binding=t,this.valueSize=n;let i,s,o;switch(e){case"quaternion":i=this._slerp,s=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,s=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,s=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=s,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(t,e){let n=this.buffer,i=this.valueSize,s=t*i+i,o=this.cumulativeWeight;if(o===0){for(let a=0;a!==i;++a)n[s+a]=n[a];o=e}else{o+=e;let a=e/o;this._mixBufferRegion(n,s,0,a,i)}this.cumulativeWeight=o}accumulateAdditive(t){let e=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(e,i,0,t,n),this.cumulativeWeightAdditive+=t}apply(t){let e=this.valueSize,n=this.buffer,i=t*e+e,s=this.cumulativeWeight,o=this.cumulativeWeightAdditive,a=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,s<1){let c=e*this._origIndex;this._mixBufferRegion(n,i,c,1-s,e)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*e,1,e);for(let c=e,l=e+e;c!==l;++c)if(n[c]!==n[c+e]){a.setValue(n,i);break}}saveOriginalState(){let t=this.binding,e=this.buffer,n=this.valueSize,i=n*this._origIndex;t.getValue(e,i);for(let s=n,o=i;s!==o;++s)e[s]=e[i+s%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let t=this.valueSize*3;this.binding.setValue(this.buffer,t)}_setAdditiveIdentityNumeric(){let t=this._addIndex*this.valueSize,e=t+this.valueSize;for(let n=t;n<e;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let t=this._origIndex*this.valueSize,e=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[e+n]=this.buffer[t+n]}_select(t,e,n,i,s){if(i>=.5)for(let o=0;o!==s;++o)t[e+o]=t[n+o]}_slerp(t,e,n,i){Ge.slerpFlat(t,e,t,e,t,n,i)}_slerpAdditive(t,e,n,i,s){let o=this._workIndex*s;Ge.multiplyQuaternionsFlat(t,o,t,e,t,n),Ge.slerpFlat(t,e,t,e,t,o,i)}_lerp(t,e,n,i,s){let o=1-i;for(let a=0;a!==s;++a){let c=e+a;t[c]=t[c]*o+t[n+a]*i}}_lerpAdditive(t,e,n,i,s){for(let o=0;o!==s;++o){let a=e+o;t[a]=t[a]+t[n+o]*i}}},qd="\\[\\]\\.:\\/",gw=new RegExp("["+qd+"]","g"),Yd="[^"+qd+"]",xw="[^"+qd.replace("\\.","")+"]",vw=/((?:WC+[\/:])*)/.source.replace("WC",Yd),_w=/(WCOD+)?/.source.replace("WCOD",xw),yw=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Yd),bw=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Yd),Mw=new RegExp("^"+vw+_w+yw+bw+"$"),Sw=["material","materials","bones","map"],rd=class{constructor(t,e,n){let i=n||he.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,i)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},he=class r{constructor(t,e,n){this.path=e,this.parsedPath=n||r.parseTrackName(e),this.node=r.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new r.Composite(t,e,n):new r(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(gw,"")}static parseTrackName(t){let e=Mw.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);Sw.indexOf(s)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=s)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===e||a.uuid===e)return a;let c=n(a.children);if(c)return c}return null},i=n(t.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)t[e++]=n[i]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,i=e.propertyName,s=e.propertyIndex;if(t||(t=r.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===l){l=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(l!==void 0){if(t[l]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[l]}}let o=t[i];if(o===void 0){let l=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",t);return}let a=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?a=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[s]!==void 0&&(s=t.morphTargetDictionary[s])}c=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(c=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=i;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};he.Composite=rd;he.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};he.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};he.prototype.GetterByBindingType=[he.prototype._getValue_direct,he.prototype._getValue_array,he.prototype._getValue_arrayElement,he.prototype._getValue_toArray];he.prototype.SetterByBindingTypeAndVersioning=[[he.prototype._setValue_direct,he.prototype._setValue_direct_setNeedsUpdate,he.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[he.prototype._setValue_array,he.prototype._setValue_array_setNeedsUpdate,he.prototype._setValue_array_setMatrixWorldNeedsUpdate],[he.prototype._setValue_arrayElement,he.prototype._setValue_arrayElement_setNeedsUpdate,he.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[he.prototype._setValue_fromArray,he.prototype._setValue_fromArray_setNeedsUpdate,he.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var sd=class{constructor(){this.isAnimationObjectGroup=!0,this.uuid=Mn(),this._objects=Array.prototype.slice.call(arguments),this.nCachedObjects_=0;let t={};this._indicesByUUID=t;for(let n=0,i=arguments.length;n!==i;++n)t[arguments[n].uuid]=n;this._paths=[],this._parsedPaths=[],this._bindings=[],this._bindingsIndicesByPath={};let e=this;this.stats={objects:{get total(){return e._objects.length},get inUse(){return this.total-e.nCachedObjects_}},get bindingsPerObject(){return e._bindings.length}}}add(){let t=this._objects,e=this._indicesByUUID,n=this._paths,i=this._parsedPaths,s=this._bindings,o=s.length,a,c=t.length,l=this.nCachedObjects_;for(let h=0,f=arguments.length;h!==f;++h){let u=arguments[h],d=u.uuid,g=e[d];if(g===void 0){g=c++,e[d]=g,t.push(u);for(let x=0,p=o;x!==p;++x)s[x].push(new he(u,n[x],i[x]))}else if(g<l){a=t[g];let x=--l,p=t[x];e[p.uuid]=g,t[g]=p,e[d]=x,t[x]=u;for(let m=0,_=o;m!==_;++m){let v=s[m],y=v[x],w=v[g];v[g]=y,w===void 0&&(w=new he(u,n[m],i[m])),v[x]=w}}else t[g]!==a&&console.error("THREE.AnimationObjectGroup: Different objects with the same UUID detected. Clean the caches or recreate your infrastructure when reloading scenes.")}this.nCachedObjects_=l}remove(){let t=this._objects,e=this._indicesByUUID,n=this._bindings,i=n.length,s=this.nCachedObjects_;for(let o=0,a=arguments.length;o!==a;++o){let c=arguments[o],l=c.uuid,h=e[l];if(h!==void 0&&h>=s){let f=s++,u=t[f];e[u.uuid]=h,t[h]=u,e[l]=f,t[f]=c;for(let d=0,g=i;d!==g;++d){let x=n[d],p=x[f],m=x[h];x[h]=p,x[f]=m}}}this.nCachedObjects_=s}uncache(){let t=this._objects,e=this._indicesByUUID,n=this._bindings,i=n.length,s=this.nCachedObjects_,o=t.length;for(let a=0,c=arguments.length;a!==c;++a){let l=arguments[a],h=l.uuid,f=e[h];if(f!==void 0)if(delete e[h],f<s){let u=--s,d=t[u],g=--o,x=t[g];e[d.uuid]=f,t[f]=d,e[x.uuid]=u,t[u]=x,t.pop();for(let p=0,m=i;p!==m;++p){let _=n[p],v=_[u],y=_[g];_[f]=v,_[u]=y,_.pop()}}else{let u=--o,d=t[u];u>0&&(e[d.uuid]=f),t[f]=d,t.pop();for(let g=0,x=i;g!==x;++g){let p=n[g];p[f]=p[u],p.pop()}}}this.nCachedObjects_=s}subscribe_(t,e){let n=this._bindingsIndicesByPath,i=n[t],s=this._bindings;if(i!==void 0)return s[i];let o=this._paths,a=this._parsedPaths,c=this._objects,l=c.length,h=this.nCachedObjects_,f=new Array(l);i=s.length,n[t]=i,o.push(t),a.push(e),s.push(f);for(let u=h,d=c.length;u!==d;++u){let g=c[u];f[u]=new he(g,t,e)}return f}unsubscribe_(t){let e=this._bindingsIndicesByPath,n=e[t];if(n!==void 0){let i=this._paths,s=this._parsedPaths,o=this._bindings,a=o.length-1,c=o[a],l=t[a];e[l]=n,o[n]=c,o.pop(),s[n]=s[a],s.pop(),i[n]=i[a],i.pop()}}},iu=class{constructor(t,e,n=null,i=e.blendMode){this._mixer=t,this._clip=e,this._localRoot=n,this.blendMode=i;let s=e.tracks,o=s.length,a=new Array(o),c={endingStart:ur,endingEnd:ur};for(let l=0;l!==o;++l){let h=s[l].createInterpolant(null);a[l]=h,h.settings=c}this._interpolantSettings=c,this._interpolants=a,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=a0,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(t){return this._startTime=t,this}setLoop(t,e){return this.loop=t,this.repetitions=e,this}setEffectiveWeight(t){return this.weight=t,this._effectiveWeight=this.enabled?t:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(t){return this._scheduleFading(t,0,1)}fadeOut(t){return this._scheduleFading(t,1,0)}crossFadeFrom(t,e,n){if(t.fadeOut(e),this.fadeIn(e),n){let i=this._clip.duration,s=t._clip.duration,o=s/i,a=i/s;t.warp(1,o,e),this.warp(a,1,e)}return this}crossFadeTo(t,e,n){return t.crossFadeFrom(this,e,n)}stopFading(){let t=this._weightInterpolant;return t!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}setEffectiveTimeScale(t){return this.timeScale=t,this._effectiveTimeScale=this.paused?0:t,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(t){return this.timeScale=this._clip.duration/t,this.stopWarping()}syncWith(t){return this.time=t.time,this.timeScale=t.timeScale,this.stopWarping()}halt(t){return this.warp(this._effectiveTimeScale,0,t)}warp(t,e,n){let i=this._mixer,s=i.time,o=this.timeScale,a=this._timeScaleInterpolant;a===null&&(a=i._lendControlInterpolant(),this._timeScaleInterpolant=a);let c=a.parameterPositions,l=a.sampleValues;return c[0]=s,c[1]=s+n,l[0]=t/o,l[1]=e/o,this}stopWarping(){let t=this._timeScaleInterpolant;return t!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(t)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(t,e,n,i){if(!this.enabled){this._updateWeight(t);return}let s=this._startTime;if(s!==null){let c=(t-s)*n;c<0||n===0?e=0:(this._startTime=null,e=n*c)}e*=this._updateTimeScale(t);let o=this._updateTime(e),a=this._updateWeight(t);if(a>0){let c=this._interpolants,l=this._propertyBindings;switch(this.blendMode){case zd:for(let h=0,f=c.length;h!==f;++h)c[h].evaluate(o),l[h].accumulateAdditive(a);break;case au:default:for(let h=0,f=c.length;h!==f;++h)c[h].evaluate(o),l[h].accumulate(i,a)}}}_updateWeight(t){let e=0;if(this.enabled){e=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=e,e}_updateTimeScale(t){let e=0;if(!this.paused){e=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(t)[0];e*=i,t>n.parameterPositions[1]&&(this.stopWarping(),e===0?this.paused=!0:this.timeScale=e)}}return this._effectiveTimeScale=e,e}_updateTime(t){let e=this._clip.duration,n=this.loop,i=this.time+t,s=this._loopCount,o=n===c0;if(t===0)return s===-1?i:o&&(s&1)===1?e-i:i;if(n===o0){s===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));t:{if(i>=e)i=e;else if(i<0)i=0;else{this.time=i;break t}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t<0?-1:1})}}else{if(s===-1&&(t>=0?(s=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=e||i<0){let a=Math.floor(i/e);i-=e*a,s+=Math.abs(a);let c=this.repetitions-s;if(c<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=t>0?e:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:t>0?1:-1});else{if(c===1){let l=t<0;this._setEndings(l,!l,o)}else this._setEndings(!1,!1,o);this._loopCount=s,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:a})}}else this.time=i;if(o&&(s&1)===1)return e-i}return i}_setEndings(t,e,n){let i=this._interpolantSettings;n?(i.endingStart=hr,i.endingEnd=hr):(t?i.endingStart=this.zeroSlopeAtStart?hr:ur:i.endingStart=Io,e?i.endingEnd=this.zeroSlopeAtEnd?hr:ur:i.endingEnd=Io)}_scheduleFading(t,e,n){let i=this._mixer,s=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let a=o.parameterPositions,c=o.sampleValues;return a[0]=s,c[0]=e,a[1]=s+t,c[1]=n,this}},Tw=new Float32Array(1),od=class extends Vn{constructor(t){super(),this._root=t,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(t,e){let n=t._localRoot||this._root,i=t._clip.tracks,s=i.length,o=t._propertyBindings,a=t._interpolants,c=n.uuid,l=this._bindingsByRootAndName,h=l[c];h===void 0&&(h={},l[c]=h);for(let f=0;f!==s;++f){let u=i[f],d=u.name,g=h[d];if(g!==void 0)++g.referenceCount,o[f]=g;else{if(g=o[f],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,c,d));continue}let x=e&&e._propertyBindings[f].binding.parsedPath;g=new nu(he.create(n,d,x),u.ValueTypeName,u.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,c,d),o[f]=g}a[f].resultBuffer=g.buffer}}_activateAction(t){if(!this._isActiveAction(t)){if(t._cacheIndex===null){let n=(t._localRoot||this._root).uuid,i=t._clip.uuid,s=this._actionsByClip[i];this._bindAction(t,s&&s.knownActions[0]),this._addInactiveAction(t,i,n)}let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let s=e[n];s.useCount++===0&&(this._lendBinding(s),s.saveOriginalState())}this._lendAction(t)}}_deactivateAction(t){if(this._isActiveAction(t)){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let s=e[n];--s.useCount===0&&(s.restoreOriginalState(),this._takeBackBinding(s))}this._takeBackAction(t)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let t=this;this.stats={actions:{get total(){return t._actions.length},get inUse(){return t._nActiveActions}},bindings:{get total(){return t._bindings.length},get inUse(){return t._nActiveBindings}},controlInterpolants:{get total(){return t._controlInterpolants.length},get inUse(){return t._nActiveControlInterpolants}}}}_isActiveAction(t){let e=t._cacheIndex;return e!==null&&e<this._nActiveActions}_addInactiveAction(t,e,n){let i=this._actions,s=this._actionsByClip,o=s[e];if(o===void 0)o={knownActions:[t],actionByRoot:{}},t._byClipCacheIndex=0,s[e]=o;else{let a=o.knownActions;t._byClipCacheIndex=a.length,a.push(t)}t._cacheIndex=i.length,i.push(t),o.actionByRoot[n]=t}_removeInactiveAction(t){let e=this._actions,n=e[e.length-1],i=t._cacheIndex;n._cacheIndex=i,e[i]=n,e.pop(),t._cacheIndex=null;let s=t._clip.uuid,o=this._actionsByClip,a=o[s],c=a.knownActions,l=c[c.length-1],h=t._byClipCacheIndex;l._byClipCacheIndex=h,c[h]=l,c.pop(),t._byClipCacheIndex=null;let f=a.actionByRoot,u=(t._localRoot||this._root).uuid;delete f[u],c.length===0&&delete o[s],this._removeInactiveBindingsForAction(t)}_removeInactiveBindingsForAction(t){let e=t._propertyBindings;for(let n=0,i=e.length;n!==i;++n){let s=e[n];--s.referenceCount===0&&this._removeInactiveBinding(s)}}_lendAction(t){let e=this._actions,n=t._cacheIndex,i=this._nActiveActions++,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_takeBackAction(t){let e=this._actions,n=t._cacheIndex,i=--this._nActiveActions,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_addInactiveBinding(t,e,n){let i=this._bindingsByRootAndName,s=this._bindings,o=i[e];o===void 0&&(o={},i[e]=o),o[n]=t,t._cacheIndex=s.length,s.push(t)}_removeInactiveBinding(t){let e=this._bindings,n=t.binding,i=n.rootNode.uuid,s=n.path,o=this._bindingsByRootAndName,a=o[i],c=e[e.length-1],l=t._cacheIndex;c._cacheIndex=l,e[l]=c,e.pop(),delete a[s],Object.keys(a).length===0&&delete o[i]}_lendBinding(t){let e=this._bindings,n=t._cacheIndex,i=this._nActiveBindings++,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_takeBackBinding(t){let e=this._bindings,n=t._cacheIndex,i=--this._nActiveBindings,s=e[i];t._cacheIndex=i,e[i]=t,s._cacheIndex=n,e[n]=s}_lendControlInterpolant(){let t=this._controlInterpolants,e=this._nActiveControlInterpolants++,n=t[e];return n===void 0&&(n=new ra(new Float32Array(2),new Float32Array(2),1,Tw),n.__cacheIndex=e,t[e]=n),n}_takeBackControlInterpolant(t){let e=this._controlInterpolants,n=t.__cacheIndex,i=--this._nActiveControlInterpolants,s=e[i];t.__cacheIndex=i,e[i]=t,s.__cacheIndex=n,e[n]=s}clipAction(t,e,n){let i=e||this._root,s=i.uuid,o=typeof t=="string"?Er.findByName(i,t):t,a=o!==null?o.uuid:t,c=this._actionsByClip[a],l=null;if(n===void 0&&(o!==null?n=o.blendMode:n=au),c!==void 0){let f=c.actionByRoot[s];if(f!==void 0&&f.blendMode===n)return f;l=c.knownActions[0],o===null&&(o=l._clip)}if(o===null)return null;let h=new iu(this,o,e,n);return this._bindAction(h,l),this._addInactiveAction(h,a,s),h}existingAction(t,e){let n=e||this._root,i=n.uuid,s=typeof t=="string"?Er.findByName(n,t):t,o=s?s.uuid:t,a=this._actionsByClip[o];return a!==void 0&&a.actionByRoot[i]||null}stopAllAction(){let t=this._actions,e=this._nActiveActions;for(let n=e-1;n>=0;--n)t[n].stop();return this}update(t){t*=this.timeScale;let e=this._actions,n=this._nActiveActions,i=this.time+=t,s=Math.sign(t),o=this._accuIndex^=1;for(let l=0;l!==n;++l)e[l]._update(i,t,s,o);let a=this._bindings,c=this._nActiveBindings;for(let l=0;l!==c;++l)a[l].apply(o);return this}setTime(t){this.time=0;for(let e=0;e<this._actions.length;e++)this._actions[e].time=0;return this.update(t)}getRoot(){return this._root}uncacheClip(t){let e=this._actions,n=t.uuid,i=this._actionsByClip,s=i[n];if(s!==void 0){let o=s.knownActions;for(let a=0,c=o.length;a!==c;++a){let l=o[a];this._deactivateAction(l);let h=l._cacheIndex,f=e[e.length-1];l._cacheIndex=null,l._byClipCacheIndex=null,f._cacheIndex=h,e[h]=f,e.pop(),this._removeInactiveBindingsForAction(l)}delete i[n]}}uncacheRoot(t){let e=t.uuid,n=this._actionsByClip;for(let o in n){let a=n[o].actionByRoot,c=a[e];c!==void 0&&(this._deactivateAction(c),this._removeInactiveAction(c))}let i=this._bindingsByRootAndName,s=i[e];if(s!==void 0)for(let o in s){let a=s[o];a.restoreOriginalState(),this._removeInactiveBinding(a)}}uncacheAction(t,e){let n=this.existingAction(t,e);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}},ad=class r{constructor(t){this.value=t}clone(){return new r(this.value.clone===void 0?this.value:this.value.clone())}},ww=0,cd=class extends Vn{constructor(){super(),this.isUniformsGroup=!0,Object.defineProperty(this,"id",{value:ww++}),this.name="",this.usage=Fo,this.uniforms=[]}add(t){return this.uniforms.push(t),this}remove(t){let e=this.uniforms.indexOf(t);return e!==-1&&this.uniforms.splice(e,1),this}setName(t){return this.name=t,this}setUsage(t){return this.usage=t,this}dispose(){return this.dispatchEvent({type:"dispose"}),this}copy(t){this.name=t.name,this.usage=t.usage;let e=t.uniforms;this.uniforms.length=0;for(let n=0,i=e.length;n<i;n++){let s=Array.isArray(e[n])?e[n]:[e[n]];for(let o=0;o<s.length;o++)this.uniforms.push(s[o].clone())}return this}clone(){return new this.constructor().copy(this)}},ld=class extends gs{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){let e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){let e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}},ud=class{constructor(t,e,n,i,s){this.isGLBufferAttribute=!0,this.name="",this.buffer=t,this.type=e,this.itemSize=n,this.elementSize=i,this.count=s,this.version=0}set needsUpdate(t){t===!0&&this.version++}setBuffer(t){return this.buffer=t,this}setType(t,e){return this.type=t,this.elementSize=e,this}setItemSize(t){return this.itemSize=t,this}setCount(t){return this.count=t,this}},fg=new dt,hd=class{constructor(t,e,n=0,i=1/0){this.ray=new Di(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new ds,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return fg.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(fg),this}intersectObject(t,e=!0,n=[]){return fd(t,this,n,e),n.sort(dg),n}intersectObjects(t,e=!0,n=[]){for(let i=0,s=t.length;i<s;i++)fd(t[i],this,n,e);return n.sort(dg),n}};function dg(r,t){return r.distance-t.distance}function fd(r,t,e,n){let i=!0;if(r.layers.test(t.layers)&&r.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){let s=r.children;for(let o=0,a=s.length;o<a;o++)fd(s[o],t,e,!0)}}var ha=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ae(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}},dd=class{constructor(t=1,e=0,n=0){return this.radius=t,this.theta=e,this.y=n,this}set(t,e,n){return this.radius=t,this.theta=e,this.y=n,this}copy(t){return this.radius=t.radius,this.theta=t.theta,this.y=t.y,this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+n*n),this.theta=Math.atan2(t,n),this.y=e,this}clone(){return new this.constructor().copy(this)}},pg=new X,pd=class{constructor(t=new X(1/0,1/0),e=new X(-1/0,-1/0)){this.isBox2=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=pg.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=1/0,this.max.x=this.max.y=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y}getCenter(t){return this.isEmpty()?t.set(0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y)}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,pg).distanceTo(t)}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},mg=new R,gc=new R,ln=class{constructor(t=new R,e=new R){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){mg.subVectors(t,this.start),gc.subVectors(this.end,this.start);let n=gc.dot(gc),s=gc.dot(mg)/n;return e&&(s=Ae(s,0,1)),s}closestPointToPoint(t,e,n){let i=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(i).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}},gg=new R,md=class extends oe{constructor(t,e){super(),this.light=t,this.matrixAutoUpdate=!1,this.color=e,this.type="SpotLightHelper";let n=new Rt,i=[0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,-1,0,1,0,0,0,0,1,1,0,0,0,0,-1,1];for(let o=0,a=1,c=32;o<c;o++,a++){let l=o/c*Math.PI*2,h=a/c*Math.PI*2;i.push(Math.cos(l),Math.sin(l),1,Math.cos(h),Math.sin(h),1)}n.setAttribute("position",new yt(i,3));let s=new Ze({fog:!1,toneMapped:!1});this.cone=new Cn(n,s),this.add(this.cone),this.update()}dispose(){this.cone.geometry.dispose(),this.cone.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),this.parent?(this.parent.updateWorldMatrix(!0),this.matrix.copy(this.parent.matrixWorld).invert().multiply(this.light.matrixWorld)):this.matrix.copy(this.light.matrixWorld),this.matrixWorld.copy(this.light.matrixWorld);let t=this.light.distance?this.light.distance:1e3,e=t*Math.tan(this.light.angle);this.cone.scale.set(e,e,t),gg.setFromMatrixPosition(this.light.target.matrixWorld),this.cone.lookAt(gg),this.color!==void 0?this.cone.material.color.set(this.color):this.cone.material.color.copy(this.light.color)}},Ai=new R,xc=new dt,cf=new dt,gd=class extends Cn{constructor(t){let e=B0(t),n=new Rt,i=[],s=[],o=new at(0,0,1),a=new at(0,1,0);for(let l=0;l<e.length;l++){let h=e[l];h.parent&&h.parent.isBone&&(i.push(0,0,0),i.push(0,0,0),s.push(o.r,o.g,o.b),s.push(a.r,a.g,a.b))}n.setAttribute("position",new yt(i,3)),n.setAttribute("color",new yt(s,3));let c=new Ze({vertexColors:!0,depthTest:!1,depthWrite:!1,toneMapped:!1,transparent:!0});super(n,c),this.isSkeletonHelper=!0,this.type="SkeletonHelper",this.root=t,this.bones=e,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1}updateMatrixWorld(t){let e=this.bones,n=this.geometry,i=n.getAttribute("position");cf.copy(this.root.matrixWorld).invert();for(let s=0,o=0;s<e.length;s++){let a=e[s];a.parent&&a.parent.isBone&&(xc.multiplyMatrices(cf,a.matrixWorld),Ai.setFromMatrixPosition(xc),i.setXYZ(o,Ai.x,Ai.y,Ai.z),xc.multiplyMatrices(cf,a.parent.matrixWorld),Ai.setFromMatrixPosition(xc),i.setXYZ(o+1,Ai.x,Ai.y,Ai.z),o+=2)}n.getAttribute("position").needsUpdate=!0,super.updateMatrixWorld(t)}dispose(){this.geometry.dispose(),this.material.dispose()}};function B0(r){let t=[];r.isBone===!0&&t.push(r);for(let e=0;e<r.children.length;e++)t.push.apply(t,B0(r.children[e]));return t}var xd=class extends Zt{constructor(t,e,n){let i=new ia(e,4,2),s=new mn({wireframe:!0,fog:!1,toneMapped:!1});super(i,s),this.light=t,this.color=n,this.type="PointLightHelper",this.matrix=this.light.matrixWorld,this.matrixAutoUpdate=!1,this.update()}dispose(){this.geometry.dispose(),this.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.color!==void 0?this.material.color.set(this.color):this.material.color.copy(this.light.color)}},Aw=new R,xg=new at,vg=new at,vd=class extends oe{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="HemisphereLightHelper";let i=new na(e);i.rotateY(Math.PI*.5),this.material=new mn({wireframe:!0,fog:!1,toneMapped:!1}),this.color===void 0&&(this.material.vertexColors=!0);let s=i.getAttribute("position"),o=new Float32Array(s.count*3);i.setAttribute("color",new Ft(o,3)),this.add(new Zt(i,this.material)),this.update()}dispose(){this.children[0].geometry.dispose(),this.children[0].material.dispose()}update(){let t=this.children[0];if(this.color!==void 0)this.material.color.set(this.color);else{let e=t.geometry.getAttribute("color");xg.copy(this.light.color),vg.copy(this.light.groundColor);for(let n=0,i=e.count;n<i;n++){let s=n<i/2?xg:vg;e.setXYZ(n,s.r,s.g,s.b)}e.needsUpdate=!0}this.light.updateWorldMatrix(!0,!1),t.lookAt(Aw.setFromMatrixPosition(this.light.matrixWorld).negate())}},_d=class extends Cn{constructor(t=10,e=10,n=4473924,i=8947848){n=new at(n),i=new at(i);let s=e/2,o=t/e,a=t/2,c=[],l=[];for(let u=0,d=0,g=-a;u<=e;u++,g+=o){c.push(-a,0,g,a,0,g),c.push(g,0,-a,g,0,a);let x=u===s?n:i;x.toArray(l,d),d+=3,x.toArray(l,d),d+=3,x.toArray(l,d),d+=3,x.toArray(l,d),d+=3}let h=new Rt;h.setAttribute("position",new yt(c,3)),h.setAttribute("color",new yt(l,3));let f=new Ze({vertexColors:!0,toneMapped:!1});super(h,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}},yd=class extends Cn{constructor(t=10,e=16,n=8,i=64,s=4473924,o=8947848){s=new at(s),o=new at(o);let a=[],c=[];if(e>1)for(let f=0;f<e;f++){let u=f/e*(Math.PI*2),d=Math.sin(u)*t,g=Math.cos(u)*t;a.push(0,0,0),a.push(d,0,g);let x=f&1?s:o;c.push(x.r,x.g,x.b),c.push(x.r,x.g,x.b)}for(let f=0;f<n;f++){let u=f&1?s:o,d=t-t/n*f;for(let g=0;g<i;g++){let x=g/i*(Math.PI*2),p=Math.sin(x)*d,m=Math.cos(x)*d;a.push(p,0,m),c.push(u.r,u.g,u.b),x=(g+1)/i*(Math.PI*2),p=Math.sin(x)*d,m=Math.cos(x)*d,a.push(p,0,m),c.push(u.r,u.g,u.b)}}let l=new Rt;l.setAttribute("position",new yt(a,3)),l.setAttribute("color",new yt(c,3));let h=new Ze({vertexColors:!0,toneMapped:!1});super(l,h),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}},_g=new R,vc=new R,yg=new R,bd=class extends oe{constructor(t,e,n){super(),this.light=t,this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",e===void 0&&(e=1);let i=new Rt;i.setAttribute("position",new yt([-e,e,0,e,e,0,e,-e,0,-e,-e,0,-e,e,0],3));let s=new Ze({fog:!1,toneMapped:!1});this.lightPlane=new Qn(i,s),this.add(this.lightPlane),i=new Rt,i.setAttribute("position",new yt([0,0,0,0,0,1],3)),this.targetLine=new Qn(i,s),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),_g.setFromMatrixPosition(this.light.matrixWorld),vc.setFromMatrixPosition(this.light.target.matrixWorld),yg.subVectors(vc,_g),this.lightPlane.lookAt(vc),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(vc),this.targetLine.scale.z=yg.length()}},_c=new R,we=new Li,Md=class extends Cn{constructor(t){let e=new Rt,n=new Ze({color:16777215,vertexColors:!0,toneMapped:!1}),i=[],s=[],o={};a("n1","n2"),a("n2","n4"),a("n4","n3"),a("n3","n1"),a("f1","f2"),a("f2","f4"),a("f4","f3"),a("f3","f1"),a("n1","f1"),a("n2","f2"),a("n3","f3"),a("n4","f4"),a("p","n1"),a("p","n2"),a("p","n3"),a("p","n4"),a("u1","u2"),a("u2","u3"),a("u3","u1"),a("c","t"),a("p","c"),a("cn1","cn2"),a("cn3","cn4"),a("cf1","cf2"),a("cf3","cf4");function a(g,x){c(g),c(x)}function c(g){i.push(0,0,0),s.push(0,0,0),o[g]===void 0&&(o[g]=[]),o[g].push(i.length/3-1)}e.setAttribute("position",new yt(i,3)),e.setAttribute("color",new yt(s,3)),super(e,n),this.type="CameraHelper",this.camera=t,this.camera.updateProjectionMatrix&&this.camera.updateProjectionMatrix(),this.matrix=t.matrixWorld,this.matrixAutoUpdate=!1,this.pointMap=o,this.update();let l=new at(16755200),h=new at(16711680),f=new at(43775),u=new at(16777215),d=new at(3355443);this.setColors(l,h,f,u,d)}setColors(t,e,n,i,s){let a=this.geometry.getAttribute("color");a.setXYZ(0,t.r,t.g,t.b),a.setXYZ(1,t.r,t.g,t.b),a.setXYZ(2,t.r,t.g,t.b),a.setXYZ(3,t.r,t.g,t.b),a.setXYZ(4,t.r,t.g,t.b),a.setXYZ(5,t.r,t.g,t.b),a.setXYZ(6,t.r,t.g,t.b),a.setXYZ(7,t.r,t.g,t.b),a.setXYZ(8,t.r,t.g,t.b),a.setXYZ(9,t.r,t.g,t.b),a.setXYZ(10,t.r,t.g,t.b),a.setXYZ(11,t.r,t.g,t.b),a.setXYZ(12,t.r,t.g,t.b),a.setXYZ(13,t.r,t.g,t.b),a.setXYZ(14,t.r,t.g,t.b),a.setXYZ(15,t.r,t.g,t.b),a.setXYZ(16,t.r,t.g,t.b),a.setXYZ(17,t.r,t.g,t.b),a.setXYZ(18,t.r,t.g,t.b),a.setXYZ(19,t.r,t.g,t.b),a.setXYZ(20,t.r,t.g,t.b),a.setXYZ(21,t.r,t.g,t.b),a.setXYZ(22,t.r,t.g,t.b),a.setXYZ(23,t.r,t.g,t.b),a.setXYZ(24,e.r,e.g,e.b),a.setXYZ(25,e.r,e.g,e.b),a.setXYZ(26,e.r,e.g,e.b),a.setXYZ(27,e.r,e.g,e.b),a.setXYZ(28,e.r,e.g,e.b),a.setXYZ(29,e.r,e.g,e.b),a.setXYZ(30,e.r,e.g,e.b),a.setXYZ(31,e.r,e.g,e.b),a.setXYZ(32,n.r,n.g,n.b),a.setXYZ(33,n.r,n.g,n.b),a.setXYZ(34,n.r,n.g,n.b),a.setXYZ(35,n.r,n.g,n.b),a.setXYZ(36,n.r,n.g,n.b),a.setXYZ(37,n.r,n.g,n.b),a.setXYZ(38,i.r,i.g,i.b),a.setXYZ(39,i.r,i.g,i.b),a.setXYZ(40,s.r,s.g,s.b),a.setXYZ(41,s.r,s.g,s.b),a.setXYZ(42,s.r,s.g,s.b),a.setXYZ(43,s.r,s.g,s.b),a.setXYZ(44,s.r,s.g,s.b),a.setXYZ(45,s.r,s.g,s.b),a.setXYZ(46,s.r,s.g,s.b),a.setXYZ(47,s.r,s.g,s.b),a.setXYZ(48,s.r,s.g,s.b),a.setXYZ(49,s.r,s.g,s.b),a.needsUpdate=!0}update(){let t=this.geometry,e=this.pointMap,n=1,i=1;we.projectionMatrixInverse.copy(this.camera.projectionMatrixInverse),Ce("c",e,t,we,0,0,-1),Ce("t",e,t,we,0,0,1),Ce("n1",e,t,we,-n,-i,-1),Ce("n2",e,t,we,n,-i,-1),Ce("n3",e,t,we,-n,i,-1),Ce("n4",e,t,we,n,i,-1),Ce("f1",e,t,we,-n,-i,1),Ce("f2",e,t,we,n,-i,1),Ce("f3",e,t,we,-n,i,1),Ce("f4",e,t,we,n,i,1),Ce("u1",e,t,we,n*.7,i*1.1,-1),Ce("u2",e,t,we,-n*.7,i*1.1,-1),Ce("u3",e,t,we,0,i*2,-1),Ce("cf1",e,t,we,-n,0,1),Ce("cf2",e,t,we,n,0,1),Ce("cf3",e,t,we,0,-i,1),Ce("cf4",e,t,we,0,i,1),Ce("cn1",e,t,we,-n,0,-1),Ce("cn2",e,t,we,n,0,-1),Ce("cn3",e,t,we,0,-i,-1),Ce("cn4",e,t,we,0,i,-1),t.getAttribute("position").needsUpdate=!0}dispose(){this.geometry.dispose(),this.material.dispose()}};function Ce(r,t,e,n,i,s,o){_c.set(i,s,o).unproject(n);let a=t[r];if(a!==void 0){let c=e.getAttribute("position");for(let l=0,h=a.length;l<h;l++)c.setXYZ(a[l],_c.x,_c.y,_c.z)}}var yc=new re,Sd=class extends Cn{constructor(t,e=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=new Float32Array(8*3),s=new Rt;s.setIndex(new Ft(n,1)),s.setAttribute("position",new Ft(i,3)),super(s,new Ze({color:e,toneMapped:!1})),this.object=t,this.type="BoxHelper",this.matrixAutoUpdate=!1,this.update()}update(t){if(t!==void 0&&console.warn("THREE.BoxHelper: .update() has no longer arguments."),this.object!==void 0&&yc.setFromObject(this.object),yc.isEmpty())return;let e=yc.min,n=yc.max,i=this.geometry.attributes.position,s=i.array;s[0]=n.x,s[1]=n.y,s[2]=n.z,s[3]=e.x,s[4]=n.y,s[5]=n.z,s[6]=e.x,s[7]=e.y,s[8]=n.z,s[9]=n.x,s[10]=e.y,s[11]=n.z,s[12]=n.x,s[13]=n.y,s[14]=e.z,s[15]=e.x,s[16]=n.y,s[17]=e.z,s[18]=e.x,s[19]=e.y,s[20]=e.z,s[21]=n.x,s[22]=e.y,s[23]=e.z,i.needsUpdate=!0,this.geometry.computeBoundingSphere()}setFromObject(t){return this.object=t,this.update(),this}copy(t,e){return super.copy(t,e),this.object=t.object,this}dispose(){this.geometry.dispose(),this.material.dispose()}},Td=class extends Cn{constructor(t,e=16776960){let n=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),i=[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,1,-1,-1,1,-1,-1,-1,-1,1,-1,-1],s=new Rt;s.setIndex(new Ft(n,1)),s.setAttribute("position",new yt(i,3)),super(s,new Ze({color:e,toneMapped:!1})),this.box=t,this.type="Box3Helper",this.geometry.computeBoundingSphere()}updateMatrixWorld(t){let e=this.box;e.isEmpty()||(e.getCenter(this.position),e.getSize(this.scale),this.scale.multiplyScalar(.5),super.updateMatrixWorld(t))}dispose(){this.geometry.dispose(),this.material.dispose()}},wd=class extends Qn{constructor(t,e=1,n=16776960){let i=n,s=[1,-1,0,-1,1,0,-1,-1,0,1,1,0,-1,1,0,-1,-1,0,1,-1,0,1,1,0],o=new Rt;o.setAttribute("position",new yt(s,3)),o.computeBoundingSphere(),super(o,new Ze({color:i,toneMapped:!1})),this.type="PlaneHelper",this.plane=t,this.size=e;let a=[1,1,0,-1,1,0,-1,-1,0,1,1,0,-1,-1,0,1,-1,0],c=new Rt;c.setAttribute("position",new yt(a,3)),c.computeBoundingSphere(),this.add(new Zt(c,new mn({color:i,opacity:.2,transparent:!0,depthWrite:!1,toneMapped:!1})))}updateMatrixWorld(t){this.position.set(0,0,0),this.scale.set(.5*this.size,.5*this.size,1),this.lookAt(this.plane.normal),this.translateZ(-this.plane.constant),super.updateMatrixWorld(t)}dispose(){this.geometry.dispose(),this.material.dispose(),this.children[0].geometry.dispose(),this.children[0].material.dispose()}},bg=new R,bc,lf,Ad=class extends oe{constructor(t=new R(0,0,1),e=new R(0,0,0),n=1,i=16776960,s=n*.2,o=s*.2){super(),this.type="ArrowHelper",bc===void 0&&(bc=new Rt,bc.setAttribute("position",new yt([0,0,0,0,1,0],3)),lf=new _s(0,.5,1,5,1),lf.translate(0,-.5,0)),this.position.copy(e),this.line=new Qn(bc,new Ze({color:i,toneMapped:!1})),this.line.matrixAutoUpdate=!1,this.add(this.line),this.cone=new Zt(lf,new mn({color:i,toneMapped:!1})),this.cone.matrixAutoUpdate=!1,this.add(this.cone),this.setDirection(t),this.setLength(n,s,o)}setDirection(t){if(t.y>.99999)this.quaternion.set(0,0,0,1);else if(t.y<-.99999)this.quaternion.set(1,0,0,0);else{bg.set(t.z,0,-t.x).normalize();let e=Math.acos(t.y);this.quaternion.setFromAxisAngle(bg,e)}}setLength(t,e=t*.2,n=e*.2){this.line.scale.set(1,Math.max(1e-4,t-e),1),this.line.updateMatrix(),this.cone.scale.set(n,e,n),this.cone.position.y=t,this.cone.updateMatrix()}setColor(t){this.line.material.color.set(t),this.cone.material.color.set(t)}copy(t){return super.copy(t,!1),this.line.copy(t.line),this.cone.copy(t.cone),this}dispose(){this.line.geometry.dispose(),this.line.material.dispose(),this.cone.geometry.dispose(),this.cone.material.dispose()}},Ed=class extends Cn{constructor(t=1){let e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new Rt;i.setAttribute("position",new yt(e,3)),i.setAttribute("color",new yt(n,3));let s=new Ze({vertexColors:!0,toneMapped:!1});super(i,s),this.type="AxesHelper"}setColors(t,e,n){let i=new at,s=this.geometry.attributes.color.array;return i.set(t),i.toArray(s,0),i.toArray(s,3),i.set(e),i.toArray(s,6),i.toArray(s,9),i.set(n),i.toArray(s,12),i.toArray(s,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}},Rd=class{constructor(){this.type="ShapePath",this.color=new at,this.subPaths=[],this.currentPath=null}moveTo(t,e){return this.currentPath=new br,this.subPaths.push(this.currentPath),this.currentPath.moveTo(t,e),this}lineTo(t,e){return this.currentPath.lineTo(t,e),this}quadraticCurveTo(t,e,n,i){return this.currentPath.quadraticCurveTo(t,e,n,i),this}bezierCurveTo(t,e,n,i,s,o){return this.currentPath.bezierCurveTo(t,e,n,i,s,o),this}splineThru(t){return this.currentPath.splineThru(t),this}toShapes(t){function e(m){let _=[];for(let v=0,y=m.length;v<y;v++){let w=m[v],S=new fi;S.curves=w.curves,_.push(S)}return _}function n(m,_){let v=_.length,y=!1;for(let w=v-1,S=0;S<v;w=S++){let T=_[w],A=_[S],M=A.x-T.x,b=A.y-T.y;if(Math.abs(b)>Number.EPSILON){if(b<0&&(T=_[S],M=-M,A=_[w],b=-b),m.y<T.y||m.y>A.y)continue;if(m.y===T.y){if(m.x===T.x)return!0}else{let I=b*(m.x-T.x)-M*(m.y-T.y);if(I===0)return!0;if(I<0)continue;y=!y}}else{if(m.y!==T.y)continue;if(A.x<=m.x&&m.x<=T.x||T.x<=m.x&&m.x<=A.x)return!0}}return y}let i=Kn.isClockWise,s=this.subPaths;if(s.length===0)return[];let o,a,c,l=[];if(s.length===1)return a=s[0],c=new fi,c.curves=a.curves,l.push(c),l;let h=!i(s[0].getPoints());h=t?!h:h;let f=[],u=[],d=[],g=0,x;u[g]=void 0,d[g]=[];for(let m=0,_=s.length;m<_;m++)a=s[m],x=a.getPoints(),o=i(x),o=t?!o:o,o?(!h&&u[g]&&g++,u[g]={s:new fi,p:x},u[g].s.curves=a.curves,h&&g++,d[g]=[]):d[g].push({h:a,p:x[0]});if(!u[0])return e(s);if(u.length>1){let m=!1,_=0;for(let v=0,y=u.length;v<y;v++)f[v]=[];for(let v=0,y=u.length;v<y;v++){let w=d[v];for(let S=0;S<w.length;S++){let T=w[S],A=!0;for(let M=0;M<u.length;M++)n(T.p,u[M].p)&&(v!==M&&_++,A?(A=!1,f[M].push(T)):m=!0);A&&f[v].push(T)}}_>0&&m===!1&&(d=f)}let p;for(let m=0,_=u.length;m<_;m++){c=u[m].s,l.push(c),p=d[m];for(let v=0,y=p.length;v<y;v++)c.holes.push(p[v].h)}return l}},Cd=class extends be{constructor(t=1,e=1,n=1,i={}){console.warn('THREE.WebGLMultipleRenderTargets has been deprecated and will be removed in r172. Use THREE.WebGLRenderTarget and set the "count" parameter to enable MRT.'),super(t,e,{...i,count:n}),this.isWebGLMultipleRenderTargets=!0}get texture(){return this.textures}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ts}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ts);var O0=Math.pow(2,-24),hu=Symbol("SKIP_GENERATION");function Zd(r){return r.index?r.index.count:r.attributes.position.count}function ei(r){return Zd(r)/3}function Jd(r,t=ArrayBuffer){return r>65535?new Uint32Array(new t(4*r)):new Uint16Array(new t(2*r))}function z0(r,t){if(!r.index){let e=r.attributes.position.count,n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,i=Jd(e,n);r.setIndex(new Ft(i,1));for(let s=0;s<e;s++)i[s]=s}}function Kd(r,t){let e=ei(r),n=t||r.drawRange,i=n.start/3,s=(n.start+n.count)/3,o=Math.max(0,i),a=Math.min(e,s)-o;return[{offset:Math.floor(o),count:Math.floor(a)}]}function Qd(r,t){if(!r.groups||!r.groups.length)return Kd(r,t);let e=[],n=new Set,i=t||r.drawRange,s=i.start/3,o=(i.start+i.count)/3;for(let c of r.groups){let l=c.start/3,h=(c.start+c.count)/3;n.add(Math.max(s,l)),n.add(Math.min(o,h))}let a=Array.from(n.values()).sort((c,l)=>c-l);for(let c=0;c<a.length-1;c++){let l=a[c],h=a[c+1];e.push({offset:Math.floor(l),count:Math.floor(h-l)})}return e}function k0(r,t){let e=ei(r),n=Qd(r,t).sort((o,a)=>o.offset-a.offset),i=n[n.length-1];i.count=Math.min(e-i.offset,i.count);let s=0;return n.forEach(({count:o})=>s+=o),e!==s}function fu(r,t,e,n,i){let s=1/0,o=1/0,a=1/0,c=-1/0,l=-1/0,h=-1/0,f=1/0,u=1/0,d=1/0,g=-1/0,x=-1/0,p=-1/0;for(let m=t*6,_=(t+e)*6;m<_;m+=6){let v=r[m+0],y=r[m+1],w=v-y,S=v+y;w<s&&(s=w),S>c&&(c=S),v<f&&(f=v),v>g&&(g=v);let T=r[m+2],A=r[m+3],M=T-A,b=T+A;M<o&&(o=M),b>l&&(l=b),T<u&&(u=T),T>x&&(x=T);let I=r[m+4],D=r[m+5],F=I-D,N=I+D;F<a&&(a=F),N>h&&(h=N),I<d&&(d=I),I>p&&(p=I)}n[0]=s,n[1]=o,n[2]=a,n[3]=c,n[4]=l,n[5]=h,i[0]=f,i[1]=u,i[2]=d,i[3]=g,i[4]=x,i[5]=p}function V0(r,t=null,e=null,n=null){let i=r.attributes.position,s=r.index?r.index.array:null,o=ei(r),a=i.normalized,c;t===null?(c=new Float32Array(o*6*4),e=0,n=o):(c=t,e=e||0,n=n||o);let l=i.array,h=i.offset||0,f=3;i.isInterleavedBufferAttribute&&(f=i.data.stride);let u=["getX","getY","getZ"];for(let d=e;d<e+n;d++){let g=d*3,x=d*6,p=g+0,m=g+1,_=g+2;s&&(p=s[p],m=s[m],_=s[_]),a||(p=p*f+h,m=m*f+h,_=_*f+h);for(let v=0;v<3;v++){let y,w,S;a?(y=i[u[v]](p),w=i[u[v]](m),S=i[u[v]](_)):(y=l[p+v],w=l[m+v],S=l[_+v]);let T=y;w<T&&(T=w),S<T&&(T=S);let A=y;w>A&&(A=w),S>A&&(A=S);let M=(A-T)/2,b=v*2;c[x+b+0]=T+M,c[x+b+1]=M+(Math.abs(T)+M)*O0}}return c}function fe(r,t,e){return e.min.x=t[r],e.min.y=t[r+1],e.min.z=t[r+2],e.max.x=t[r+3],e.max.y=t[r+4],e.max.z=t[r+5],e}function jd(r){let t=-1,e=-1/0;for(let n=0;n<3;n++){let i=r[n+3]-r[n];i>e&&(e=i,t=n)}return t}function tp(r,t){t.set(r)}function ep(r,t,e){let n,i;for(let s=0;s<3;s++){let o=s+3;n=r[s],i=t[s],e[s]=n<i?n:i,n=r[o],i=t[o],e[o]=n>i?n:i}}function ma(r,t,e){for(let n=0;n<3;n++){let i=t[r+2*n],s=t[r+2*n+1],o=i-s,a=i+s;o<e[n]&&(e[n]=o),a>e[n+3]&&(e[n+3]=a)}}function Rs(r){let t=r[3]-r[0],e=r[4]-r[1],n=r[5]-r[2];return 2*(t*e+e*n+n*t)}var xi=32,Rw=(r,t)=>r.candidate-t.candidate,Hi=new Array(xi).fill().map(()=>({count:0,bounds:new Float32Array(6),rightCacheBounds:new Float32Array(6),leftCacheBounds:new Float32Array(6),candidate:0})),du=new Float32Array(6);function W0(r,t,e,n,i,s){let o=-1,a=0;if(s===0)o=jd(t),o!==-1&&(a=(t[o]+t[o+3])/2);else if(s===1)o=jd(r),o!==-1&&(a=Cw(e,n,i,o));else if(s===2){let c=Rs(r),l=1.25*i,h=n*6,f=(n+i)*6;for(let u=0;u<3;u++){let d=t[u],p=(t[u+3]-d)/xi;if(i<xi/4){let m=[...Hi];m.length=i;let _=0;for(let y=h;y<f;y+=6,_++){let w=m[_];w.candidate=e[y+2*u],w.count=0;let{bounds:S,leftCacheBounds:T,rightCacheBounds:A}=w;for(let M=0;M<3;M++)A[M]=1/0,A[M+3]=-1/0,T[M]=1/0,T[M+3]=-1/0,S[M]=1/0,S[M+3]=-1/0;ma(y,e,S)}m.sort(Rw);let v=i;for(let y=0;y<v;y++){let w=m[y];for(;y+1<v&&m[y+1].candidate===w.candidate;)m.splice(y+1,1),v--}for(let y=h;y<f;y+=6){let w=e[y+2*u];for(let S=0;S<v;S++){let T=m[S];w>=T.candidate?ma(y,e,T.rightCacheBounds):(ma(y,e,T.leftCacheBounds),T.count++)}}for(let y=0;y<v;y++){let w=m[y],S=w.count,T=i-w.count,A=w.leftCacheBounds,M=w.rightCacheBounds,b=0;S!==0&&(b=Rs(A)/c);let I=0;T!==0&&(I=Rs(M)/c);let D=1+1.25*(b*S+I*T);D<l&&(o=u,l=D,a=w.candidate)}}else{for(let v=0;v<xi;v++){let y=Hi[v];y.count=0,y.candidate=d+p+v*p;let w=y.bounds;for(let S=0;S<3;S++)w[S]=1/0,w[S+3]=-1/0}for(let v=h;v<f;v+=6){let S=~~((e[v+2*u]-d)/p);S>=xi&&(S=xi-1);let T=Hi[S];T.count++,ma(v,e,T.bounds)}let m=Hi[xi-1];tp(m.bounds,m.rightCacheBounds);for(let v=xi-2;v>=0;v--){let y=Hi[v],w=Hi[v+1];ep(y.bounds,w.rightCacheBounds,y.rightCacheBounds)}let _=0;for(let v=0;v<xi-1;v++){let y=Hi[v],w=y.count,S=y.bounds,A=Hi[v+1].rightCacheBounds;w!==0&&(_===0?tp(S,du):ep(S,du,du)),_+=w;let M=0,b=0;_!==0&&(M=Rs(du)/c);let I=i-_;I!==0&&(b=Rs(A)/c);let D=1+1.25*(M*_+b*I);D<l&&(o=u,l=D,a=y.candidate)}}}}else console.warn(`MeshBVH: Invalid build strategy value ${s} used.`);return{axis:o,pos:a}}function Cw(r,t,e,n){let i=0;for(let s=t,o=t+e;s<o;s++)i+=r[s*6+n*2];return i/e}var Cs=class{constructor(){this.boundingData=new Float32Array(6)}};function X0(r,t,e,n,i,s){let o=n,a=n+i-1,c=s.pos,l=s.axis*2;for(;;){for(;o<=a&&e[o*6+l]<c;)o++;for(;o<=a&&e[a*6+l]>=c;)a--;if(o<a){for(let h=0;h<3;h++){let f=t[o*3+h];t[o*3+h]=t[a*3+h],t[a*3+h]=f}for(let h=0;h<6;h++){let f=e[o*6+h];e[o*6+h]=e[a*6+h],e[a*6+h]=f}o++,a--}else return o}}function q0(r,t,e,n,i,s){let o=n,a=n+i-1,c=s.pos,l=s.axis*2;for(;;){for(;o<=a&&e[o*6+l]<c;)o++;for(;o<=a&&e[a*6+l]>=c;)a--;if(o<a){let h=r[o];r[o]=r[a],r[a]=h;for(let f=0;f<6;f++){let u=e[o*6+f];e[o*6+f]=e[a*6+f],e[a*6+f]=u}o++,a--}else return o}}function xe(r,t){return t[r+15]===65535}function Me(r,t){return t[r+6]}function Ee(r,t){return t[r+14]}function Xe(r){return r+8}function ze(r,t){return t[r+6]}function Is(r,t){return t[r+7]}var Y0,ga,gu,$0,Iw=Math.pow(2,32);function xu(r){return"count"in r?1:1+xu(r.left)+xu(r.right)}function Z0(r,t,e){return Y0=new Float32Array(e),ga=new Uint32Array(e),gu=new Uint16Array(e),$0=new Uint8Array(e),np(r,t)}function np(r,t){let e=r/4,n=r/2,i="count"in t,s=t.boundingData;for(let o=0;o<6;o++)Y0[e+o]=s[o];if(i)if(t.buffer){let o=t.buffer;$0.set(new Uint8Array(o),r);for(let a=r,c=r+o.byteLength;a<c;a+=32){let l=a/2;xe(l,gu)||(ga[a/4+6]+=e)}return r+o.byteLength}else{let o=t.offset,a=t.count;return ga[e+6]=o,gu[n+14]=a,gu[n+15]=65535,r+32}else{let o=t.left,a=t.right,c=t.splitAxis,l;if(l=np(r+32,o),l/4>Iw)throw new Error("MeshBVH: Cannot store child pointer greater than 32 bits.");return ga[e+6]=l/4,l=np(l,a),ga[e+7]=c,l}}function Pw(r,t){let e=(r.index?r.index.count:r.attributes.position.count)/3,n=e>2**16,i=n?4:2,s=t?new SharedArrayBuffer(e*i):new ArrayBuffer(e*i),o=n?new Uint32Array(s):new Uint16Array(s);for(let a=0,c=o.length;a<c;a++)o[a]=a;return o}function Dw(r,t,e,n,i){let{maxDepth:s,verbose:o,maxLeafTris:a,strategy:c,onProgress:l,indirect:h}=i,f=r._indirectBuffer,u=r.geometry,d=u.index?u.index.array:null,g=h?q0:X0,x=ei(u),p=new Float32Array(6),m=!1,_=new Cs;return fu(t,e,n,_.boundingData,p),y(_,e,n,p),_;function v(w){l&&l(w/x)}function y(w,S,T,A=null,M=0){if(!m&&M>=s&&(m=!0,o&&(console.warn(`MeshBVH: Max depth of ${s} reached when generating BVH. Consider increasing maxDepth.`),console.warn(u))),T<=a||M>=s)return v(S+T),w.offset=S,w.count=T,w;let b=W0(w.boundingData,A,t,S,T,c);if(b.axis===-1)return v(S+T),w.offset=S,w.count=T,w;let I=g(f,d,t,S,T,b);if(I===S||I===S+T)v(S+T),w.offset=S,w.count=T;else{w.splitAxis=b.axis;let D=new Cs,F=S,N=I-S;w.left=D,fu(t,F,N,D.boundingData,p),y(D,F,N,p,M+1);let k=new Cs,U=I,$=T-N;w.right=k,fu(t,U,$,k.boundingData,p),y(k,U,$,p,M+1)}return w}}function J0(r,t){let e=r.geometry;t.indirect&&(r._indirectBuffer=Pw(e,t.useSharedArrayBuffer),k0(e,t.range)&&!t.verbose&&console.warn('MeshBVH: Provided geometry contains groups or a range that do not fully span the vertex contents while using the "indirect" option. BVH may incorrectly report intersections on unrendered portions of the geometry.')),r._indirectBuffer||z0(e,t);let n=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,i=V0(e),s=t.indirect?Kd(e,t.range):Qd(e,t.range);r._roots=s.map(o=>{let a=Dw(r,i,o.offset,o.count,t),c=xu(a),l=new n(32*c);return Z0(0,a,l),l})}var gn=class{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(t,e){let n=1/0,i=-1/0;for(let s=0,o=t.length;s<o;s++){let c=t[s][e];n=c<n?c:n,i=c>i?c:i}this.min=n,this.max=i}setFromPoints(t,e){let n=1/0,i=-1/0;for(let s=0,o=e.length;s<o;s++){let a=e[s],c=t.dot(a);n=c<n?c:n,i=c>i?c:i}this.min=n,this.max=i}isSeparated(t){return this.min>t.max||t.min>this.max}};gn.prototype.setFromBox=function(){let r=new R;return function(e,n){let i=n.min,s=n.max,o=1/0,a=-1/0;for(let c=0;c<=1;c++)for(let l=0;l<=1;l++)for(let h=0;h<=1;h++){r.x=i.x*c+s.x*(1-c),r.y=i.y*l+s.y*(1-l),r.z=i.z*h+s.z*(1-h);let f=e.dot(r);o=Math.min(f,o),a=Math.max(f,a)}this.min=o,this.max=a}}();var j1=function(){let r=new gn;return function(e,n){let i=e.points,s=e.satAxes,o=e.satBounds,a=n.points,c=n.satAxes,l=n.satBounds;for(let h=0;h<3;h++){let f=o[h],u=s[h];if(r.setFromPoints(u,a),f.isSeparated(r))return!1}for(let h=0;h<3;h++){let f=l[h],u=c[h];if(r.setFromPoints(u,i),f.isSeparated(r))return!1}}}();var Lw=function(){let r=new R,t=new R,e=new R;return function(i,s,o){let a=i.start,c=r,l=s.start,h=t;e.subVectors(a,l),r.subVectors(i.end,i.start),t.subVectors(s.end,s.start);let f=e.dot(h),u=h.dot(c),d=h.dot(h),g=e.dot(c),p=c.dot(c)*d-u*u,m,_;p!==0?m=(f*u-g*d)/p:m=0,_=(f+m*u)/d,o.x=m,o.y=_}}(),xa=function(){let r=new X,t=new R,e=new R;return function(i,s,o,a){Lw(i,s,r);let c=r.x,l=r.y;if(c>=0&&c<=1&&l>=0&&l<=1){i.at(c,o),s.at(l,a);return}else if(c>=0&&c<=1){l<0?s.at(0,a):s.at(1,a),i.closestPointToPoint(a,!0,o);return}else if(l>=0&&l<=1){c<0?i.at(0,o):i.at(1,o),s.closestPointToPoint(o,!0,a);return}else{let h;c<0?h=i.start:h=i.end;let f;l<0?f=s.start:f=s.end;let u=t,d=e;if(i.closestPointToPoint(f,!0,t),s.closestPointToPoint(h,!0,e),u.distanceToSquared(f)<=d.distanceToSquared(h)){o.copy(u),a.copy(f);return}else{o.copy(h),a.copy(d);return}}}}(),K0=function(){let r=new R,t=new R,e=new fn,n=new ln;return function(s,o){let{radius:a,center:c}=s,{a:l,b:h,c:f}=o;if(n.start=l,n.end=h,n.closestPointToPoint(c,!0,r).distanceTo(c)<=a||(n.start=l,n.end=f,n.closestPointToPoint(c,!0,r).distanceTo(c)<=a)||(n.start=h,n.end=f,n.closestPointToPoint(c,!0,r).distanceTo(c)<=a))return!0;let x=o.getPlane(e);if(Math.abs(x.distanceToPoint(c))<=a){let m=x.projectPoint(c,t);if(o.containsPoint(m))return!0}return!1}}();var Fw=1e-15;function ip(r){return Math.abs(r)<Fw}var Je=class extends en{constructor(...t){super(...t),this.isExtendedTriangle=!0,this.satAxes=new Array(4).fill().map(()=>new R),this.satBounds=new Array(4).fill().map(()=>new gn),this.points=[this.a,this.b,this.c],this.sphere=new Ue,this.plane=new fn,this.needsUpdate=!0}intersectsSphere(t){return K0(t,this)}update(){let t=this.a,e=this.b,n=this.c,i=this.points,s=this.satAxes,o=this.satBounds,a=s[0],c=o[0];this.getNormal(a),c.setFromPoints(a,i);let l=s[1],h=o[1];l.subVectors(t,e),h.setFromPoints(l,i);let f=s[2],u=o[2];f.subVectors(e,n),u.setFromPoints(f,i);let d=s[3],g=o[3];d.subVectors(n,t),g.setFromPoints(d,i),this.sphere.setFromPoints(this.points),this.plane.setFromNormalAndCoplanarPoint(a,t),this.needsUpdate=!1}};Je.prototype.closestPointToSegment=function(){let r=new R,t=new R,e=new ln;return function(i,s=null,o=null){let{start:a,end:c}=i,l=this.points,h,f=1/0;for(let u=0;u<3;u++){let d=(u+1)%3;e.start.copy(l[u]),e.end.copy(l[d]),xa(e,i,r,t),h=r.distanceToSquared(t),h<f&&(f=h,s&&s.copy(r),o&&o.copy(t))}return this.closestPointToPoint(a,r),h=a.distanceToSquared(r),h<f&&(f=h,s&&s.copy(r),o&&o.copy(a)),this.closestPointToPoint(c,r),h=c.distanceToSquared(r),h<f&&(f=h,s&&s.copy(r),o&&o.copy(c)),Math.sqrt(f)}}();Je.prototype.intersectsTriangle=function(){let r=new Je,t=new Array(3),e=new Array(3),n=new gn,i=new gn,s=new R,o=new R,a=new R,c=new R,l=new R,h=new ln,f=new ln,u=new ln,d=new R;function g(x,p,m){let _=x.points,v=0,y=-1;for(let w=0;w<3;w++){let{start:S,end:T}=h;S.copy(_[w]),T.copy(_[(w+1)%3]),h.delta(o);let A=ip(p.distanceToPoint(S));if(ip(p.normal.dot(o))&&A){m.copy(h),v=2;break}let M=p.intersectLine(h,d);if(!M&&A&&d.copy(S),(M||A)&&!ip(d.distanceTo(T))){if(v<=1)(v===1?m.start:m.end).copy(d),A&&(y=v);else if(v>=2){(y===1?m.start:m.end).copy(d),v=2;break}if(v++,v===2&&y===-1)break}}return v}return function(p,m=null,_=!1){this.needsUpdate&&this.update(),p.isExtendedTriangle?p.needsUpdate&&p.update():(r.copy(p),r.update(),p=r);let v=this.plane,y=p.plane;if(Math.abs(v.normal.dot(y.normal))>1-1e-10){let w=this.satBounds,S=this.satAxes;e[0]=p.a,e[1]=p.b,e[2]=p.c;for(let M=0;M<4;M++){let b=w[M],I=S[M];if(n.setFromPoints(I,e),b.isSeparated(n))return!1}let T=p.satBounds,A=p.satAxes;t[0]=this.a,t[1]=this.b,t[2]=this.c;for(let M=0;M<4;M++){let b=T[M],I=A[M];if(n.setFromPoints(I,t),b.isSeparated(n))return!1}for(let M=0;M<4;M++){let b=S[M];for(let I=0;I<4;I++){let D=A[I];if(s.crossVectors(b,D),n.setFromPoints(s,t),i.setFromPoints(s,e),n.isSeparated(i))return!1}}return m&&(_||console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0."),m.start.set(0,0,0),m.end.set(0,0,0)),!0}else{let w=g(this,y,f);if(w===1&&p.containsPoint(f.end))return m&&(m.start.copy(f.end),m.end.copy(f.end)),!0;if(w!==2)return!1;let S=g(p,v,u);if(S===1&&this.containsPoint(u.end))return m&&(m.start.copy(u.end),m.end.copy(u.end)),!0;if(S!==2)return!1;if(f.delta(a),u.delta(c),a.dot(c)<0){let F=u.start;u.start=u.end,u.end=F}let T=f.start.dot(a),A=f.end.dot(a),M=u.start.dot(a),b=u.end.dot(a),I=A<M,D=T<b;return T!==b&&M!==A&&I===D?!1:(m&&(l.subVectors(f.start,u.start),l.dot(a)>0?m.start.copy(f.start):m.start.copy(u.start),l.subVectors(f.end,u.end),l.dot(a)<0?m.end.copy(f.end):m.end.copy(u.end)),!0)}}}();Je.prototype.distanceToPoint=function(){let r=new R;return function(e){return this.closestPointToPoint(e,r),e.distanceTo(r)}}();Je.prototype.distanceToTriangle=function(){let r=new R,t=new R,e=["a","b","c"],n=new ln,i=new ln;return function(o,a=null,c=null){let l=a||c?n:null;if(this.intersectsTriangle(o,l))return(a||c)&&(a&&l.getCenter(a),c&&l.getCenter(c)),0;let h=1/0;for(let f=0;f<3;f++){let u,d=e[f],g=o[d];this.closestPointToPoint(g,r),u=g.distanceToSquared(r),u<h&&(h=u,a&&a.copy(r),c&&c.copy(g));let x=this[d];o.closestPointToPoint(x,r),u=x.distanceToSquared(r),u<h&&(h=u,a&&a.copy(x),c&&c.copy(r))}for(let f=0;f<3;f++){let u=e[f],d=e[(f+1)%3];n.set(this[u],this[d]);for(let g=0;g<3;g++){let x=e[g],p=e[(g+1)%3];i.set(o[x],o[p]),xa(n,i,r,t);let m=r.distanceToSquared(t);m<h&&(h=m,a&&a.copy(r),c&&c.copy(t))}}return Math.sqrt(h)}}();var Re=class{constructor(t,e,n){this.isOrientedBox=!0,this.min=new R,this.max=new R,this.matrix=new dt,this.invMatrix=new dt,this.points=new Array(8).fill().map(()=>new R),this.satAxes=new Array(3).fill().map(()=>new R),this.satBounds=new Array(3).fill().map(()=>new gn),this.alignedSatBounds=new Array(3).fill().map(()=>new gn),this.needsUpdate=!1,t&&this.min.copy(t),e&&this.max.copy(e),n&&this.matrix.copy(n)}set(t,e,n){this.min.copy(t),this.max.copy(e),this.matrix.copy(n),this.needsUpdate=!0}copy(t){this.min.copy(t.min),this.max.copy(t.max),this.matrix.copy(t.matrix),this.needsUpdate=!0}};Re.prototype.update=function(){return function(){let t=this.matrix,e=this.min,n=this.max,i=this.points;for(let l=0;l<=1;l++)for(let h=0;h<=1;h++)for(let f=0;f<=1;f++){let u=1*l|2*h|4*f,d=i[u];d.x=l?n.x:e.x,d.y=h?n.y:e.y,d.z=f?n.z:e.z,d.applyMatrix4(t)}let s=this.satBounds,o=this.satAxes,a=i[0];for(let l=0;l<3;l++){let h=o[l],f=s[l],u=1<<l,d=i[u];h.subVectors(a,d),f.setFromPoints(h,i)}let c=this.alignedSatBounds;c[0].setFromPointsField(i,"x"),c[1].setFromPointsField(i,"y"),c[2].setFromPointsField(i,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}}();Re.prototype.intersectsBox=function(){let r=new gn;return function(e){this.needsUpdate&&this.update();let n=e.min,i=e.max,s=this.satBounds,o=this.satAxes,a=this.alignedSatBounds;if(r.min=n.x,r.max=i.x,a[0].isSeparated(r)||(r.min=n.y,r.max=i.y,a[1].isSeparated(r))||(r.min=n.z,r.max=i.z,a[2].isSeparated(r)))return!1;for(let c=0;c<3;c++){let l=o[c],h=s[c];if(r.setFromBox(l,e),h.isSeparated(r))return!1}return!0}}();Re.prototype.intersectsTriangle=function(){let r=new Je,t=new Array(3),e=new gn,n=new gn,i=new R;return function(o){this.needsUpdate&&this.update(),o.isExtendedTriangle?o.needsUpdate&&o.update():(r.copy(o),r.update(),o=r);let a=this.satBounds,c=this.satAxes;t[0]=o.a,t[1]=o.b,t[2]=o.c;for(let u=0;u<3;u++){let d=a[u],g=c[u];if(e.setFromPoints(g,t),d.isSeparated(e))return!1}let l=o.satBounds,h=o.satAxes,f=this.points;for(let u=0;u<3;u++){let d=l[u],g=h[u];if(e.setFromPoints(g,f),d.isSeparated(e))return!1}for(let u=0;u<3;u++){let d=c[u];for(let g=0;g<4;g++){let x=h[g];if(i.crossVectors(d,x),e.setFromPoints(i,t),n.setFromPoints(i,f),e.isSeparated(n))return!1}}return!0}}();Re.prototype.closestPointToPoint=function(){return function(t,e){return this.needsUpdate&&this.update(),e.copy(t).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),e}}();Re.prototype.distanceToPoint=function(){let r=new R;return function(e){return this.closestPointToPoint(e,r),e.distanceTo(r)}}();Re.prototype.distanceToBox=function(){let r=["x","y","z"],t=new Array(12).fill().map(()=>new ln),e=new Array(12).fill().map(()=>new ln),n=new R,i=new R;return function(o,a=0,c=null,l=null){if(this.needsUpdate&&this.update(),this.intersectsBox(o))return(c||l)&&(o.getCenter(i),this.closestPointToPoint(i,n),o.closestPointToPoint(n,i),c&&c.copy(n),l&&l.copy(i)),0;let h=a*a,f=o.min,u=o.max,d=this.points,g=1/0;for(let p=0;p<8;p++){let m=d[p];i.copy(m).clamp(f,u);let _=m.distanceToSquared(i);if(_<g&&(g=_,c&&c.copy(m),l&&l.copy(i),_<h))return Math.sqrt(_)}let x=0;for(let p=0;p<3;p++)for(let m=0;m<=1;m++)for(let _=0;_<=1;_++){let v=(p+1)%3,y=(p+2)%3,w=m<<v|_<<y,S=1<<p|m<<v|_<<y,T=d[w],A=d[S];t[x].set(T,A);let b=r[p],I=r[v],D=r[y],F=e[x],N=F.start,k=F.end;N[b]=f[b],N[I]=m?f[I]:u[I],N[D]=_?f[D]:u[I],k[b]=u[b],k[I]=m?f[I]:u[I],k[D]=_?f[D]:u[I],x++}for(let p=0;p<=1;p++)for(let m=0;m<=1;m++)for(let _=0;_<=1;_++){i.x=p?u.x:f.x,i.y=m?u.y:f.y,i.z=_?u.z:f.z,this.closestPointToPoint(i,n);let v=i.distanceToSquared(n);if(v<g&&(g=v,c&&c.copy(n),l&&l.copy(i),v<h))return Math.sqrt(v)}for(let p=0;p<12;p++){let m=t[p];for(let _=0;_<12;_++){let v=e[_];xa(m,v,n,i);let y=n.distanceToSquared(i);if(y<g&&(g=y,c&&c.copy(n),l&&l.copy(i),y<h))return Math.sqrt(y)}}return Math.sqrt(g)}}();var Wi=class{constructor(t){this._getNewPrimitive=t,this._primitives=[]}getPrimitive(){let t=this._primitives;return t.length===0?this._getNewPrimitive():t.pop()}releasePrimitive(t){this._primitives.push(t)}};var rp=class extends Wi{constructor(){super(()=>new Je)}},un=new rp;var sp=class{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;let t=[],e=null;this.setBuffer=n=>{e&&t.push(e),e=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{e=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,t.length!==0&&this.setBuffer(t.pop())}}},ne=new sp;var Xi,Ds,Ps=[],_u=new Wi(()=>new re);function Q0(r,t,e,n,i,s){Xi=_u.getPrimitive(),Ds=_u.getPrimitive(),Ps.push(Xi,Ds),ne.setBuffer(r._roots[t]);let o=op(0,r.geometry,e,n,i,s);ne.clearBuffer(),_u.releasePrimitive(Xi),_u.releasePrimitive(Ds),Ps.pop(),Ps.pop();let a=Ps.length;return a>0&&(Ds=Ps[a-1],Xi=Ps[a-2]),o}function op(r,t,e,n,i=null,s=0,o=0){let{float32Array:a,uint16Array:c,uint32Array:l}=ne,h=r*2;if(xe(h,c)){let u=Me(r,l),d=Ee(h,c);return fe(r,a,Xi),n(u,d,!1,o,s+r,Xi)}else{let b=function(D){let{uint16Array:F,uint32Array:N}=ne,k=D*2;for(;!xe(k,F);)D=Xe(D),k=D*2;return Me(D,N)},I=function(D){let{uint16Array:F,uint32Array:N}=ne,k=D*2;for(;!xe(k,F);)D=ze(D,N),k=D*2;return Me(D,N)+Ee(k,F)},u=Xe(r),d=ze(r,l),g=u,x=d,p,m,_,v;if(i&&(_=Xi,v=Ds,fe(g,a,_),fe(x,a,v),p=i(_),m=i(v),m<p)){g=d,x=u;let D=p;p=m,m=D,_=v}_||(_=Xi,fe(g,a,_));let y=xe(g*2,c),w=e(_,y,p,o+1,s+g),S;if(w===2){let D=b(g),N=I(g)-D;S=n(D,N,!0,o+1,s+g,_)}else S=w&&op(g,t,e,n,i,s,o+1);if(S)return!0;v=Ds,fe(x,a,v);let T=xe(x*2,c),A=e(v,T,m,o+1,s+x),M;if(A===2){let D=b(x),N=I(x)-D;M=n(D,N,!0,o+1,s+x,v)}else M=A&&op(x,t,e,n,i,s,o+1);return!!M}}var va=new R,ap=new R;function j0(r,t,e={},n=0,i=1/0){let s=n*n,o=i*i,a=1/0,c=null;if(r.shapecast({boundsTraverseOrder:h=>(va.copy(t).clamp(h.min,h.max),va.distanceToSquared(t)),intersectsBounds:(h,f,u)=>u<a&&u<o,intersectsTriangle:(h,f)=>{h.closestPointToPoint(t,va);let u=t.distanceToSquared(va);return u<a&&(ap.copy(va),a=u,c=f),u<s}}),a===1/0)return null;let l=Math.sqrt(a);return e.point?e.point.copy(ap):e.point=ap.clone(),e.distance=l,e.faceIndex=c,e}var Ls=new R,Fs=new R,Ns=new R,bu=new X,Mu=new X,Su=new X,tx=new R,ex=new R,nx=new R,Tu=new R;function Uw(r,t,e,n,i,s,o,a){let c;if(s===Ie?c=r.intersectTriangle(n,e,t,!0,i):c=r.intersectTriangle(t,e,n,s!==dn,i),c===null)return null;let l=r.origin.distanceTo(i);return l<o||l>a?null:{distance:l,point:i.clone()}}function Bw(r,t,e,n,i,s,o,a,c,l,h){Ls.fromBufferAttribute(t,s),Fs.fromBufferAttribute(t,o),Ns.fromBufferAttribute(t,a);let f=Uw(r,Ls,Fs,Ns,Tu,c,l,h);if(f){n&&(bu.fromBufferAttribute(n,s),Mu.fromBufferAttribute(n,o),Su.fromBufferAttribute(n,a),f.uv=en.getInterpolation(Tu,Ls,Fs,Ns,bu,Mu,Su,new X)),i&&(bu.fromBufferAttribute(i,s),Mu.fromBufferAttribute(i,o),Su.fromBufferAttribute(i,a),f.uv1=en.getInterpolation(Tu,Ls,Fs,Ns,bu,Mu,Su,new X)),e&&(tx.fromBufferAttribute(e,s),ex.fromBufferAttribute(e,o),nx.fromBufferAttribute(e,a),f.normal=en.getInterpolation(Tu,Ls,Fs,Ns,tx,ex,nx,new R),f.normal.dot(r.direction)>0&&f.normal.multiplyScalar(-1));let u={a:s,b:o,c:a,normal:new R,materialIndex:0};en.getNormal(Ls,Fs,Ns,u.normal),f.face=u,f.faceIndex=s}return f}function Us(r,t,e,n,i,s,o){let a=n*3,c=a+0,l=a+1,h=a+2,f=r.index;r.index&&(c=f.getX(c),l=f.getX(l),h=f.getX(h));let{position:u,normal:d,uv:g,uv1:x}=r.attributes,p=Bw(e,u,d,g,x,c,l,h,t,s,o);return p?(p.faceIndex=n,i&&i.push(p),p):null}function de(r,t,e,n){let i=r.a,s=r.b,o=r.c,a=t,c=t+1,l=t+2;e&&(a=e.getX(a),c=e.getX(c),l=e.getX(l)),i.x=n.getX(a),i.y=n.getY(a),i.z=n.getZ(a),s.x=n.getX(c),s.y=n.getY(c),s.z=n.getZ(c),o.x=n.getX(l),o.y=n.getY(l),o.z=n.getZ(l)}function ix(r,t,e,n,i,s,o,a){let{geometry:c,_indirectBuffer:l}=r;for(let h=n,f=n+i;h<f;h++)Us(c,t,e,h,s,o,a)}function rx(r,t,e,n,i,s,o){let{geometry:a,_indirectBuffer:c}=r,l=1/0,h=null;for(let f=n,u=n+i;f<u;f++){let d;d=Us(a,t,e,f,null,s,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function sx(r,t,e,n,i,s,o){let{geometry:a}=e,{index:c}=a,l=a.attributes.position;for(let h=r,f=t+r;h<f;h++){let u;if(u=h,de(o,u*3,c,l),o.needsUpdate=!0,n(o,u,i,s))return!0}return!1}function ox(r,t=null){t&&Array.isArray(t)&&(t=new Set(t));let e=r.geometry,n=e.index?e.index.array:null,i=e.attributes.position,s,o,a,c,l=0,h=r._roots;for(let u=0,d=h.length;u<d;u++)s=h[u],o=new Uint32Array(s),a=new Uint16Array(s),c=new Float32Array(s),f(0,l),l+=s.byteLength;function f(u,d,g=!1){let x=u*2;if(a[x+15]===65535){let m=o[u+6],_=a[x+14],v=1/0,y=1/0,w=1/0,S=-1/0,T=-1/0,A=-1/0;for(let M=3*m,b=3*(m+_);M<b;M++){let I=n[M],D=i.getX(I),F=i.getY(I),N=i.getZ(I);D<v&&(v=D),D>S&&(S=D),F<y&&(y=F),F>T&&(T=F),N<w&&(w=N),N>A&&(A=N)}return c[u+0]!==v||c[u+1]!==y||c[u+2]!==w||c[u+3]!==S||c[u+4]!==T||c[u+5]!==A?(c[u+0]=v,c[u+1]=y,c[u+2]=w,c[u+3]=S,c[u+4]=T,c[u+5]=A,!0):!1}else{let m=u+8,_=o[u+6],v=m+d,y=_+d,w=g,S=!1,T=!1;t?w||(S=t.has(v),T=t.has(y),w=!S&&!T):(S=!0,T=!0);let A=w||S,M=w||T,b=!1;A&&(b=f(m,d,w));let I=!1;M&&(I=f(_,d,w));let D=b||I;if(D)for(let F=0;F<3;F++){let N=m+F,k=_+F,U=c[N],$=c[N+3],W=c[k],st=c[k+3];c[u+F]=U<W?U:W,c[u+F+3]=$>st?$:st}return D}}}function In(r,t,e,n,i){let s,o,a,c,l,h,f=1/e.direction.x,u=1/e.direction.y,d=1/e.direction.z,g=e.origin.x,x=e.origin.y,p=e.origin.z,m=t[r],_=t[r+3],v=t[r+1],y=t[r+3+1],w=t[r+2],S=t[r+3+2];return f>=0?(s=(m-g)*f,o=(_-g)*f):(s=(_-g)*f,o=(m-g)*f),u>=0?(a=(v-x)*u,c=(y-x)*u):(a=(y-x)*u,c=(v-x)*u),s>c||a>o||((a>s||isNaN(s))&&(s=a),(c<o||isNaN(o))&&(o=c),d>=0?(l=(w-p)*d,h=(S-p)*d):(l=(S-p)*d,h=(w-p)*d),s>h||l>o)?!1:((l>s||s!==s)&&(s=l),(h<o||o!==o)&&(o=h),s<=i&&o>=n)}function ax(r,t,e,n,i,s,o,a){let{geometry:c,_indirectBuffer:l}=r;for(let h=n,f=n+i;h<f;h++){let u=l?l[h]:h;Us(c,t,e,u,s,o,a)}}function cx(r,t,e,n,i,s,o){let{geometry:a,_indirectBuffer:c}=r,l=1/0,h=null;for(let f=n,u=n+i;f<u;f++){let d;d=Us(a,t,e,c?c[f]:f,null,s,o),d&&d.distance<l&&(h=d,l=d.distance)}return h}function lx(r,t,e,n,i,s,o){let{geometry:a}=e,{index:c}=a,l=a.attributes.position;for(let h=r,f=t+r;h<f;h++){let u;if(u=e.resolveTriangleIndex(h),de(o,u*3,c,l),o.needsUpdate=!0,n(o,u,i,s))return!0}return!1}function ux(r,t,e,n,i,s,o){ne.setBuffer(r._roots[t]),cp(0,r,e,n,i,s,o),ne.clearBuffer()}function cp(r,t,e,n,i,s,o){let{float32Array:a,uint16Array:c,uint32Array:l}=ne,h=r*2;if(xe(h,c)){let u=Me(r,l),d=Ee(h,c);ix(t,e,n,u,d,i,s,o)}else{let u=Xe(r);In(u,a,n,s,o)&&cp(u,t,e,n,i,s,o);let d=ze(r,l);In(d,a,n,s,o)&&cp(d,t,e,n,i,s,o)}}var Ow=["x","y","z"];function hx(r,t,e,n,i,s){ne.setBuffer(r._roots[t]);let o=lp(0,r,e,n,i,s);return ne.clearBuffer(),o}function lp(r,t,e,n,i,s){let{float32Array:o,uint16Array:a,uint32Array:c}=ne,l=r*2;if(xe(l,a)){let f=Me(r,c),u=Ee(l,a);return rx(t,e,n,f,u,i,s)}else{let f=Is(r,c),u=Ow[f],g=n.direction[u]>=0,x,p;g?(x=Xe(r),p=ze(r,c)):(x=ze(r,c),p=Xe(r));let _=In(x,o,n,i,s)?lp(x,t,e,n,i,s):null;if(_){let w=_.point[u];if(g?w<=o[p+f]:w>=o[p+f+3])return _}let y=In(p,o,n,i,s)?lp(p,t,e,n,i,s):null;return _&&y?_.distance<=y.distance?_:y:_||y||null}}var wu=new re,Bs=new Je,Os=new Je,_a=new dt,fx=new Re,Au=new Re;function dx(r,t,e,n){ne.setBuffer(r._roots[t]);let i=up(0,r,e,n);return ne.clearBuffer(),i}function up(r,t,e,n,i=null){let{float32Array:s,uint16Array:o,uint32Array:a}=ne,c=r*2;if(i===null&&(e.boundingBox||e.computeBoundingBox(),fx.set(e.boundingBox.min,e.boundingBox.max,n),i=fx),xe(c,o)){let h=t.geometry,f=h.index,u=h.attributes.position,d=e.index,g=e.attributes.position,x=Me(r,a),p=Ee(c,o);if(_a.copy(n).invert(),e.boundsTree)return fe(r,s,Au),Au.matrix.copy(_a),Au.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:_=>Au.intersectsBox(_),intersectsTriangle:_=>{_.a.applyMatrix4(n),_.b.applyMatrix4(n),_.c.applyMatrix4(n),_.needsUpdate=!0;for(let v=x*3,y=(p+x)*3;v<y;v+=3)if(de(Os,v,f,u),Os.needsUpdate=!0,_.intersectsTriangle(Os))return!0;return!1}});for(let m=x*3,_=(p+x)*3;m<_;m+=3){de(Bs,m,f,u),Bs.a.applyMatrix4(_a),Bs.b.applyMatrix4(_a),Bs.c.applyMatrix4(_a),Bs.needsUpdate=!0;for(let v=0,y=d.count;v<y;v+=3)if(de(Os,v,d,g),Os.needsUpdate=!0,Bs.intersectsTriangle(Os))return!0}}else{let h=r+8,f=a[r+6];return fe(h,s,wu),!!(i.intersectsBox(wu)&&up(h,t,e,n,i)||(fe(f,s,wu),i.intersectsBox(wu)&&up(f,t,e,n,i)))}}var Eu=new dt,hp=new Re,ya=new Re,zw=new R,kw=new R,Vw=new R,Hw=new R;function px(r,t,e,n={},i={},s=0,o=1/0){t.boundingBox||t.computeBoundingBox(),hp.set(t.boundingBox.min,t.boundingBox.max,e),hp.needsUpdate=!0;let a=r.geometry,c=a.attributes.position,l=a.index,h=t.attributes.position,f=t.index,u=un.getPrimitive(),d=un.getPrimitive(),g=zw,x=kw,p=null,m=null;i&&(p=Vw,m=Hw);let _=1/0,v=null,y=null;return Eu.copy(e).invert(),ya.matrix.copy(Eu),r.shapecast({boundsTraverseOrder:w=>hp.distanceToBox(w),intersectsBounds:(w,S,T)=>T<_&&T<o?(S&&(ya.min.copy(w.min),ya.max.copy(w.max),ya.needsUpdate=!0),!0):!1,intersectsRange:(w,S)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:A=>ya.distanceToBox(A),intersectsBounds:(A,M,b)=>b<_&&b<o,intersectsRange:(A,M)=>{for(let b=A,I=A+M;b<I;b++){de(d,3*b,f,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let D=w,F=w+S;D<F;D++){de(u,3*D,l,c),u.needsUpdate=!0;let N=u.distanceToTriangle(d,g,p);if(N<_&&(x.copy(g),m&&m.copy(p),_=N,v=D,y=b),N<s)return!0}}}});{let T=ei(t);for(let A=0,M=T;A<M;A++){de(d,3*A,f,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let b=w,I=w+S;b<I;b++){de(u,3*b,l,c),u.needsUpdate=!0;let D=u.distanceToTriangle(d,g,p);if(D<_&&(x.copy(g),m&&m.copy(p),_=D,v=b,y=A),D<s)return!0}}}}}),un.releasePrimitive(u),un.releasePrimitive(d),_===1/0?null:(n.point?n.point.copy(x):n.point=x.clone(),n.distance=_,n.faceIndex=v,i&&(i.point?i.point.copy(m):i.point=m.clone(),i.point.applyMatrix4(Eu),x.applyMatrix4(Eu),i.distance=x.sub(i.point).length(),i.faceIndex=y),n)}function mx(r,t=null){t&&Array.isArray(t)&&(t=new Set(t));let e=r.geometry,n=e.index?e.index.array:null,i=e.attributes.position,s,o,a,c,l=0,h=r._roots;for(let u=0,d=h.length;u<d;u++)s=h[u],o=new Uint32Array(s),a=new Uint16Array(s),c=new Float32Array(s),f(0,l),l+=s.byteLength;function f(u,d,g=!1){let x=u*2;if(a[x+15]===65535){let m=o[u+6],_=a[x+14],v=1/0,y=1/0,w=1/0,S=-1/0,T=-1/0,A=-1/0;for(let M=m,b=m+_;M<b;M++){let I=3*r.resolveTriangleIndex(M);for(let D=0;D<3;D++){let F=I+D;F=n?n[F]:F;let N=i.getX(F),k=i.getY(F),U=i.getZ(F);N<v&&(v=N),N>S&&(S=N),k<y&&(y=k),k>T&&(T=k),U<w&&(w=U),U>A&&(A=U)}}return c[u+0]!==v||c[u+1]!==y||c[u+2]!==w||c[u+3]!==S||c[u+4]!==T||c[u+5]!==A?(c[u+0]=v,c[u+1]=y,c[u+2]=w,c[u+3]=S,c[u+4]=T,c[u+5]=A,!0):!1}else{let m=u+8,_=o[u+6],v=m+d,y=_+d,w=g,S=!1,T=!1;t?w||(S=t.has(v),T=t.has(y),w=!S&&!T):(S=!0,T=!0);let A=w||S,M=w||T,b=!1;A&&(b=f(m,d,w));let I=!1;M&&(I=f(_,d,w));let D=b||I;if(D)for(let F=0;F<3;F++){let N=m+F,k=_+F,U=c[N],$=c[N+3],W=c[k],st=c[k+3];c[u+F]=U<W?U:W,c[u+F+3]=$>st?$:st}return D}}}function gx(r,t,e,n,i,s,o){ne.setBuffer(r._roots[t]),fp(0,r,e,n,i,s,o),ne.clearBuffer()}function fp(r,t,e,n,i,s,o){let{float32Array:a,uint16Array:c,uint32Array:l}=ne,h=r*2;if(xe(h,c)){let u=Me(r,l),d=Ee(h,c);ax(t,e,n,u,d,i,s,o)}else{let u=Xe(r);In(u,a,n,s,o)&&fp(u,t,e,n,i,s,o);let d=ze(r,l);In(d,a,n,s,o)&&fp(d,t,e,n,i,s,o)}}var Gw=["x","y","z"];function xx(r,t,e,n,i,s){ne.setBuffer(r._roots[t]);let o=dp(0,r,e,n,i,s);return ne.clearBuffer(),o}function dp(r,t,e,n,i,s){let{float32Array:o,uint16Array:a,uint32Array:c}=ne,l=r*2;if(xe(l,a)){let f=Me(r,c),u=Ee(l,a);return cx(t,e,n,f,u,i,s)}else{let f=Is(r,c),u=Gw[f],g=n.direction[u]>=0,x,p;g?(x=Xe(r),p=ze(r,c)):(x=ze(r,c),p=Xe(r));let _=In(x,o,n,i,s)?dp(x,t,e,n,i,s):null;if(_){let w=_.point[u];if(g?w<=o[p+f]:w>=o[p+f+3])return _}let y=In(p,o,n,i,s)?dp(p,t,e,n,i,s):null;return _&&y?_.distance<=y.distance?_:y:_||y||null}}var Ru=new re,zs=new Je,ks=new Je,ba=new dt,vx=new Re,Cu=new Re;function _x(r,t,e,n){ne.setBuffer(r._roots[t]);let i=pp(0,r,e,n);return ne.clearBuffer(),i}function pp(r,t,e,n,i=null){let{float32Array:s,uint16Array:o,uint32Array:a}=ne,c=r*2;if(i===null&&(e.boundingBox||e.computeBoundingBox(),vx.set(e.boundingBox.min,e.boundingBox.max,n),i=vx),xe(c,o)){let h=t.geometry,f=h.index,u=h.attributes.position,d=e.index,g=e.attributes.position,x=Me(r,a),p=Ee(c,o);if(ba.copy(n).invert(),e.boundsTree)return fe(r,s,Cu),Cu.matrix.copy(ba),Cu.needsUpdate=!0,e.boundsTree.shapecast({intersectsBounds:_=>Cu.intersectsBox(_),intersectsTriangle:_=>{_.a.applyMatrix4(n),_.b.applyMatrix4(n),_.c.applyMatrix4(n),_.needsUpdate=!0;for(let v=x,y=p+x;v<y;v++)if(de(ks,3*t.resolveTriangleIndex(v),f,u),ks.needsUpdate=!0,_.intersectsTriangle(ks))return!0;return!1}});for(let m=x,_=p+x;m<_;m++){let v=t.resolveTriangleIndex(m);de(zs,3*v,f,u),zs.a.applyMatrix4(ba),zs.b.applyMatrix4(ba),zs.c.applyMatrix4(ba),zs.needsUpdate=!0;for(let y=0,w=d.count;y<w;y+=3)if(de(ks,y,d,g),ks.needsUpdate=!0,zs.intersectsTriangle(ks))return!0}}else{let h=r+8,f=a[r+6];return fe(h,s,Ru),!!(i.intersectsBox(Ru)&&pp(h,t,e,n,i)||(fe(f,s,Ru),i.intersectsBox(Ru)&&pp(f,t,e,n,i)))}}var Iu=new dt,mp=new Re,Ma=new Re,Ww=new R,Xw=new R,qw=new R,Yw=new R;function yx(r,t,e,n={},i={},s=0,o=1/0){t.boundingBox||t.computeBoundingBox(),mp.set(t.boundingBox.min,t.boundingBox.max,e),mp.needsUpdate=!0;let a=r.geometry,c=a.attributes.position,l=a.index,h=t.attributes.position,f=t.index,u=un.getPrimitive(),d=un.getPrimitive(),g=Ww,x=Xw,p=null,m=null;i&&(p=qw,m=Yw);let _=1/0,v=null,y=null;return Iu.copy(e).invert(),Ma.matrix.copy(Iu),r.shapecast({boundsTraverseOrder:w=>mp.distanceToBox(w),intersectsBounds:(w,S,T)=>T<_&&T<o?(S&&(Ma.min.copy(w.min),Ma.max.copy(w.max),Ma.needsUpdate=!0),!0):!1,intersectsRange:(w,S)=>{if(t.boundsTree){let T=t.boundsTree;return T.shapecast({boundsTraverseOrder:A=>Ma.distanceToBox(A),intersectsBounds:(A,M,b)=>b<_&&b<o,intersectsRange:(A,M)=>{for(let b=A,I=A+M;b<I;b++){let D=T.resolveTriangleIndex(b);de(d,3*D,f,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let F=w,N=w+S;F<N;F++){let k=r.resolveTriangleIndex(F);de(u,3*k,l,c),u.needsUpdate=!0;let U=u.distanceToTriangle(d,g,p);if(U<_&&(x.copy(g),m&&m.copy(p),_=U,v=F,y=b),U<s)return!0}}}})}else{let T=ei(t);for(let A=0,M=T;A<M;A++){de(d,3*A,f,h),d.a.applyMatrix4(e),d.b.applyMatrix4(e),d.c.applyMatrix4(e),d.needsUpdate=!0;for(let b=w,I=w+S;b<I;b++){let D=r.resolveTriangleIndex(b);de(u,3*D,l,c),u.needsUpdate=!0;let F=u.distanceToTriangle(d,g,p);if(F<_&&(x.copy(g),m&&m.copy(p),_=F,v=b,y=A),F<s)return!0}}}}}),un.releasePrimitive(u),un.releasePrimitive(d),_===1/0?null:(n.point?n.point.copy(x):n.point=x.clone(),n.distance=_,n.faceIndex=v,i&&(i.point?i.point.copy(m):i.point=m.clone(),i.point.applyMatrix4(Iu),x.applyMatrix4(Iu),i.distance=x.sub(i.point).length(),i.faceIndex=y),n)}function bx(){return typeof SharedArrayBuffer<"u"}var Sa=new ne.constructor,Pu=new ne.constructor,qi=new Wi(()=>new re),Vs=new re,Hs=new re,gp=new re,xp=new re,vp=!1;function Mx(r,t,e,n){if(vp)throw new Error("MeshBVH: Recursive calls to bvhcast not supported.");vp=!0;let i=r._roots,s=t._roots,o,a=0,c=0,l=new dt().copy(e).invert();for(let h=0,f=i.length;h<f;h++){Sa.setBuffer(i[h]),c=0;let u=qi.getPrimitive();fe(0,Sa.float32Array,u),u.applyMatrix4(l);for(let d=0,g=s.length;d<g&&(Pu.setBuffer(s[d]),o=Xn(0,0,e,l,n,a,c,0,0,u),Pu.clearBuffer(),c+=s[d].length,!o);d++);if(qi.releasePrimitive(u),Sa.clearBuffer(),a+=i[h].length,o)break}return vp=!1,o}function Xn(r,t,e,n,i,s=0,o=0,a=0,c=0,l=null,h=!1){let f,u;h?(f=Pu,u=Sa):(f=Sa,u=Pu);let d=f.float32Array,g=f.uint32Array,x=f.uint16Array,p=u.float32Array,m=u.uint32Array,_=u.uint16Array,v=r*2,y=t*2,w=xe(v,x),S=xe(y,_),T=!1;if(S&&w)h?T=i(Me(t,m),Ee(t*2,_),Me(r,g),Ee(r*2,x),c,o+t,a,s+r):T=i(Me(r,g),Ee(r*2,x),Me(t,m),Ee(t*2,_),a,s+r,c,o+t);else if(S){let A=qi.getPrimitive();fe(t,p,A),A.applyMatrix4(e);let M=Xe(r),b=ze(r,g);fe(M,d,Vs),fe(b,d,Hs);let I=A.intersectsBox(Vs),D=A.intersectsBox(Hs);T=I&&Xn(t,M,n,e,i,o,s,c,a+1,A,!h)||D&&Xn(t,b,n,e,i,o,s,c,a+1,A,!h),qi.releasePrimitive(A)}else{let A=Xe(t),M=ze(t,m);fe(A,p,gp),fe(M,p,xp);let b=l.intersectsBox(gp),I=l.intersectsBox(xp);if(b&&I)T=Xn(r,A,e,n,i,s,o,a,c+1,l,h)||Xn(r,M,e,n,i,s,o,a,c+1,l,h);else if(b)if(w)T=Xn(r,A,e,n,i,s,o,a,c+1,l,h);else{let D=qi.getPrimitive();D.copy(gp).applyMatrix4(e);let F=Xe(r),N=ze(r,g);fe(F,d,Vs),fe(N,d,Hs);let k=D.intersectsBox(Vs),U=D.intersectsBox(Hs);T=k&&Xn(A,F,n,e,i,o,s,c,a+1,D,!h)||U&&Xn(A,N,n,e,i,o,s,c,a+1,D,!h),qi.releasePrimitive(D)}else if(I)if(w)T=Xn(r,M,e,n,i,s,o,a,c+1,l,h);else{let D=qi.getPrimitive();D.copy(xp).applyMatrix4(e);let F=Xe(r),N=ze(r,g);fe(F,d,Vs),fe(N,d,Hs);let k=D.intersectsBox(Vs),U=D.intersectsBox(Hs);T=k&&Xn(M,F,n,e,i,o,s,c,a+1,D,!h)||U&&Xn(M,N,n,e,i,o,s,c,a+1,D,!h),qi.releasePrimitive(D)}}return T}var Du=new Re,Sx=new re,$w={strategy:0,maxDepth:40,maxLeafTris:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null},Pr=class r{static serialize(t,e={}){e={cloneBuffers:!0,...e};let n=t.geometry,i=t._roots,s=t._indirectBuffer,o=n.getIndex(),a;return e.cloneBuffers?a={roots:i.map(c=>c.slice()),index:o?o.array.slice():null,indirectBuffer:s?s.slice():null}:a={roots:i,index:o?o.array:null,indirectBuffer:s},a}static deserialize(t,e,n={}){n={setIndex:!0,indirect:!!t.indirectBuffer,...n};let{index:i,roots:s,indirectBuffer:o}=t,a=new r(e,{...n,[hu]:!0});if(a._roots=s,a._indirectBuffer=o||null,n.setIndex){let c=e.getIndex();if(c===null){let l=new Ft(t.index,1,!1);e.setIndex(l)}else c.array!==i&&(c.array.set(i),c.needsUpdate=!0)}return a}get indirect(){return!!this._indirectBuffer}constructor(t,e={}){if(t.isBufferGeometry){if(t.index&&t.index.isInterleavedBufferAttribute)throw new Error("MeshBVH: InterleavedBufferAttribute is not supported for the index attribute.")}else throw new Error("MeshBVH: Only BufferGeometries are supported.");if(e=Object.assign({...$w,[hu]:!1},e),e.useSharedArrayBuffer&&!bx())throw new Error("MeshBVH: SharedArrayBuffer is not available.");this.geometry=t,this._roots=null,this._indirectBuffer=null,e[hu]||(J0(this,e),!t.boundingBox&&e.setBoundingBox&&(t.boundingBox=this.getBoundingBox(new re))),this.resolveTriangleIndex=e.indirect?n=>this._indirectBuffer[n]:n=>n}refit(t=null){return(this.indirect?mx:ox)(this,t)}traverse(t,e=0){let n=this._roots[e],i=new Uint32Array(n),s=new Uint16Array(n);o(0);function o(a,c=0){let l=a*2,h=s[l+15]===65535;if(h){let f=i[a+6],u=s[l+14];t(c,h,new Float32Array(n,a*4,6),f,u)}else{let f=a+32/4,u=i[a+6],d=i[a+7];t(c,h,new Float32Array(n,a*4,6),d)||(o(f,c+1),o(u,c+1))}}}raycast(t,e=pn,n=0,i=1/0){let s=this._roots,o=this.geometry,a=[],c=e.isMaterial,l=Array.isArray(e),h=o.groups,f=c?e.side:e,u=this.indirect?gx:ux;for(let d=0,g=s.length;d<g;d++){let x=l?e[h[d].materialIndex].side:f,p=a.length;if(u(this,d,x,t,a,n,i),l){let m=h[d].materialIndex;for(let _=p,v=a.length;_<v;_++)a[_].face.materialIndex=m}}return a}raycastFirst(t,e=pn,n=0,i=1/0){let s=this._roots,o=this.geometry,a=e.isMaterial,c=Array.isArray(e),l=null,h=o.groups,f=a?e.side:e,u=this.indirect?xx:hx;for(let d=0,g=s.length;d<g;d++){let x=c?e[h[d].materialIndex].side:f,p=u(this,d,x,t,n,i);p!=null&&(l==null||p.distance<l.distance)&&(l=p,c&&(p.face.materialIndex=h[d].materialIndex))}return l}intersectsGeometry(t,e){let n=!1,i=this._roots,s=this.indirect?_x:dx;for(let o=0,a=i.length;o<a&&(n=s(this,o,t,e),!n);o++);return n}shapecast(t){let e=un.getPrimitive(),n=this.indirect?lx:sx,{boundsTraverseOrder:i,intersectsBounds:s,intersectsRange:o,intersectsTriangle:a}=t;if(o&&a){let f=o;o=(u,d,g,x,p)=>f(u,d,g,x,p)?!0:n(u,d,this,a,g,x,e)}else o||(a?o=(f,u,d,g)=>n(f,u,this,a,d,g,e):o=(f,u,d)=>d);let c=!1,l=0,h=this._roots;for(let f=0,u=h.length;f<u;f++){let d=h[f];if(c=Q0(this,f,s,o,i,l),c)break;l+=d.byteLength}return un.releasePrimitive(e),c}bvhcast(t,e,n){let{intersectsRanges:i,intersectsTriangles:s}=n,o=un.getPrimitive(),a=this.geometry.index,c=this.geometry.attributes.position,l=this.indirect?g=>{let x=this.resolveTriangleIndex(g);de(o,x*3,a,c)}:g=>{de(o,g*3,a,c)},h=un.getPrimitive(),f=t.geometry.index,u=t.geometry.attributes.position,d=t.indirect?g=>{let x=t.resolveTriangleIndex(g);de(h,x*3,f,u)}:g=>{de(h,g*3,f,u)};if(s){let g=(x,p,m,_,v,y,w,S)=>{for(let T=m,A=m+_;T<A;T++){d(T),h.a.applyMatrix4(e),h.b.applyMatrix4(e),h.c.applyMatrix4(e),h.needsUpdate=!0;for(let M=x,b=x+p;M<b;M++)if(l(M),o.needsUpdate=!0,s(o,h,M,T,v,y,w,S))return!0}return!1};if(i){let x=i;i=function(p,m,_,v,y,w,S,T){return x(p,m,_,v,y,w,S,T)?!0:g(p,m,_,v,y,w,S,T)}}else i=g}return Mx(this,t,e,i)}intersectsBox(t,e){return Du.set(t.min,t.max,e),Du.needsUpdate=!0,this.shapecast({intersectsBounds:n=>Du.intersectsBox(n),intersectsTriangle:n=>Du.intersectsTriangle(n)})}intersectsSphere(t){return this.shapecast({intersectsBounds:e=>t.intersectsBox(e),intersectsTriangle:e=>e.intersectsSphere(t)})}closestPointToGeometry(t,e,n={},i={},s=0,o=1/0){return(this.indirect?yx:px)(this,t,e,n,i,s,o)}closestPointToPoint(t,e={},n=0,i=1/0){return j0(this,t,e,n,i)}getBoundingBox(t){return t.makeEmpty(),this._roots.forEach(n=>{fe(0,new Float32Array(n),Sx),t.union(Sx)}),t}};function Zw(r){switch(r){case 1:return"R";case 2:return"RG";case 3:return"RGBA";case 4:return"RGBA"}throw new Error}function Jw(r){switch(r){case 1:return Gn;case 2:return Ir;case 3:return Lt;case 4:return Lt}}function Tx(r){switch(r){case 1:return Cr;case 2:return zi;case 3:return ki;case 4:return ki}}var Lu=class extends jt{constructor(){super(),this.minFilter=Nt,this.magFilter=Nt,this.generateMipmaps=!1,this.overrideItemSize=null,this._forcedType=null}updateFrom(t){let e=this.overrideItemSize,n=t.itemSize,i=t.count;if(e!==null){if(n*i%e!==0)throw new Error("VertexAttributeTexture: overrideItemSize must divide evenly into buffer length.");t.itemSize=e,t.count=i*n/e}let s=t.itemSize,o=t.count,a=t.normalized,c=t.array.constructor,l=c.BYTES_PER_ELEMENT,h=this._forcedType,f=s;if(h===null)switch(c){case Float32Array:h=Dt;break;case Uint8Array:case Uint16Array:case Uint32Array:h=nn;break;case Int8Array:case Int16Array:case Int32Array:h=Oi;break}let u,d,g,x,p=Zw(s);switch(h){case Dt:g=1,d=Jw(s),a&&l===1?(x=c,p+="8",c===Uint8Array?u=cn:(u=As,p+="_SNORM")):(x=Float32Array,p+="32F",u=Dt);break;case Oi:p+=l*8+"I",g=a?Math.pow(2,c.BYTES_PER_ELEMENT*8-1):1,d=Tx(s),l===1?(x=Int8Array,u=As):l===2?(x=Int16Array,u=da):(x=Int32Array,u=Oi);break;case nn:p+=l*8+"UI",g=a?Math.pow(2,c.BYTES_PER_ELEMENT*8-1):1,d=Tx(s),l===1?(x=Uint8Array,u=cn):l===2?(x=Uint16Array,u=Ii):(x=Uint32Array,u=nn);break}f===3&&(d===Lt||d===ki)&&(f=4);let m=Math.ceil(Math.sqrt(o))||1,_=f*m*m,v=new x(_),y=t.normalized;t.normalized=!1;for(let w=0;w<o;w++){let S=f*w;v[S]=t.getX(w)/g,s>=2&&(v[S+1]=t.getY(w)/g),s>=3&&(v[S+2]=t.getZ(w)/g,f===4&&(v[S+3]=1)),s>=4&&(v[S+3]=t.getW(w)/g)}t.normalized=y,this.internalFormat=p,this.format=d,this.type=u,this.image.width=m,this.image.height=m,this.image.data=v,this.needsUpdate=!0,this.dispose(),t.itemSize=n,t.count=i}},Gs=class extends Lu{constructor(){super(),this._forcedType=nn}};var Ws=class extends Lu{constructor(){super(),this._forcedType=Dt}};var Fu=class{constructor(){this.index=new Gs,this.position=new Ws,this.bvhBounds=new jt,this.bvhContents=new jt,this._cachedIndexAttr=null,this.index.overrideItemSize=3}updateFrom(t){let{geometry:e}=t;if(Qw(t,this.bvhBounds,this.bvhContents),this.position.updateFrom(e.attributes.position),t.indirect){let n=t._indirectBuffer;if(this._cachedIndexAttr===null||this._cachedIndexAttr.count!==n.length)if(e.index)this._cachedIndexAttr=e.index.clone();else{let i=Jd(Zd(e));this._cachedIndexAttr=new Ft(i,1,!1)}Kw(e,n,this._cachedIndexAttr),this.index.updateFrom(this._cachedIndexAttr)}else this.index.updateFrom(e.index)}dispose(){let{index:t,position:e,bvhBounds:n,bvhContents:i}=this;t&&t.dispose(),e&&e.dispose(),n&&n.dispose(),i&&i.dispose()}};function Kw(r,t,e){let n=e.array,i=r.index?r.index.array:null;for(let s=0,o=t.length;s<o;s++){let a=3*s,c=3*t[s];for(let l=0;l<3;l++)n[a+l]=i?i[c+l]:c+l}}function Qw(r,t,e){let n=r._roots;if(n.length!==1)throw new Error("MeshBVHUniformStruct: Multi-root BVHs not supported.");let i=n[0],s=new Uint16Array(i),o=new Uint32Array(i),a=new Float32Array(i),c=i.byteLength/32,l=2*Math.ceil(Math.sqrt(c/2)),h=new Float32Array(4*l*l),f=Math.ceil(Math.sqrt(c)),u=new Uint32Array(2*f*f);for(let d=0;d<c;d++){let g=d*32/4,x=g*2,p=g;for(let m=0;m<3;m++)h[8*d+0+m]=a[p+0+m],h[8*d+4+m]=a[p+3+m];if(xe(x,s)){let m=Ee(x,s),_=Me(g,o),v=4294901760|m;u[d*2+0]=v,u[d*2+1]=_}else{let m=4*ze(g,o)/32,_=Is(g,o);u[d*2+0]=_,u[d*2+1]=m}}t.image.data=h,t.image.width=l,t.image.height=l,t.format=Lt,t.type=Dt,t.internalFormat="RGBA32F",t.minFilter=Nt,t.magFilter=Nt,t.generateMipmaps=!1,t.needsUpdate=!0,t.dispose(),e.image.data=u,e.image.width=f,e.image.height=f,e.format=zi,e.type=nn,e.internalFormat="RG32UI",e.minFilter=Nt,e.magFilter=Nt,e.generateMipmaps=!1,e.needsUpdate=!0,e.dispose()}var Dr={};Hp(Dr,{bvh_distance_functions:()=>wx,bvh_ray_functions:()=>yp,bvh_struct_definitions:()=>Ax,common_functions:()=>_p});var _p=`

// A stack of uint32 indices can can store the indices for
// a perfectly balanced tree with a depth up to 31. Lower stack
// depth gets higher performance.
//
// However not all trees are balanced. Best value to set this to
// is the trees max depth.
#ifndef BVH_STACK_DEPTH
#define BVH_STACK_DEPTH 60
#endif

#ifndef INFINITY
#define INFINITY 1e20
#endif

// Utilities
uvec4 uTexelFetch1D( usampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

ivec4 iTexelFetch1D( isampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 texelFetch1D( sampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 textureSampleBarycoord( sampler2D tex, vec3 barycoord, uvec3 faceIndices ) {

	return
		barycoord.x * texelFetch1D( tex, faceIndices.x ) +
		barycoord.y * texelFetch1D( tex, faceIndices.y ) +
		barycoord.z * texelFetch1D( tex, faceIndices.z );

}

void ndcToCameraRay(
	vec2 coord, mat4 cameraWorld, mat4 invProjectionMatrix,
	out vec3 rayOrigin, out vec3 rayDirection
) {

	// get camera look direction and near plane for camera clipping
	vec4 lookDirection = cameraWorld * vec4( 0.0, 0.0, - 1.0, 0.0 );
	vec4 nearVector = invProjectionMatrix * vec4( 0.0, 0.0, - 1.0, 1.0 );
	float near = abs( nearVector.z / nearVector.w );

	// get the camera direction and position from camera matrices
	vec4 origin = cameraWorld * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec4 direction = invProjectionMatrix * vec4( coord, 0.5, 1.0 );
	direction /= direction.w;
	direction = cameraWorld * direction - origin;

	// slide the origin along the ray until it sits at the near clip plane position
	origin.xyz += direction.xyz * near / dot( direction, lookDirection );

	rayOrigin = origin.xyz;
	rayDirection = direction.xyz;

}
`;var wx=`

float dot2( vec3 v ) {

	return dot( v, v );

}

// https://www.shadertoy.com/view/ttfGWl
vec3 closestPointToTriangle( vec3 p, vec3 v0, vec3 v1, vec3 v2, out vec3 barycoord ) {

    vec3 v10 = v1 - v0;
    vec3 v21 = v2 - v1;
    vec3 v02 = v0 - v2;

	vec3 p0 = p - v0;
	vec3 p1 = p - v1;
	vec3 p2 = p - v2;

    vec3 nor = cross( v10, v02 );

    // method 2, in barycentric space
    vec3  q = cross( nor, p0 );
    float d = 1.0 / dot2( nor );
    float u = d * dot( q, v02 );
    float v = d * dot( q, v10 );
    float w = 1.0 - u - v;

	if( u < 0.0 ) {

		w = clamp( dot( p2, v02 ) / dot2( v02 ), 0.0, 1.0 );
		u = 0.0;
		v = 1.0 - w;

	} else if( v < 0.0 ) {

		u = clamp( dot( p0, v10 ) / dot2( v10 ), 0.0, 1.0 );
		v = 0.0;
		w = 1.0 - u;

	} else if( w < 0.0 ) {

		v = clamp( dot( p1, v21 ) / dot2( v21 ), 0.0, 1.0 );
		w = 0.0;
		u = 1.0-v;

	}

	barycoord = vec3( u, v, w );
    return u * v1 + v * v2 + w * v0;

}

float distanceToTriangles(
	// geometry info and triangle range
	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,

	// point and cut off range
	vec3 point, float closestDistanceSquared,

	// outputs
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord, inout float side, inout vec3 outPoint
) {

	bool found = false;
	vec3 localBarycoord;
	for ( uint i = offset, l = offset + count; i < l; i ++ ) {

		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;
		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;
		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;
		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;

		// get the closest point and barycoord
		vec3 closestPoint = closestPointToTriangle( point, a, b, c, localBarycoord );
		vec3 delta = point - closestPoint;
		float sqDist = dot2( delta );
		if ( sqDist < closestDistanceSquared ) {

			// set the output results
			closestDistanceSquared = sqDist;
			faceIndices = uvec4( indices.xyz, i );
			faceNormal = normalize( cross( a - b, b - c ) );
			barycoord = localBarycoord;
			outPoint = closestPoint;
			side = sign( dot( faceNormal, delta ) );

		}

	}

	return closestDistanceSquared;

}

float distanceSqToBounds( vec3 point, vec3 boundsMin, vec3 boundsMax ) {

	vec3 clampedPoint = clamp( point, boundsMin, boundsMax );
	vec3 delta = point - clampedPoint;
	return dot( delta, delta );

}

float distanceSqToBVHNodeBoundsPoint( vec3 point, sampler2D bvhBounds, uint currNodeIndex ) {

	uint cni2 = currNodeIndex * 2u;
	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;
	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;
	return distanceSqToBounds( point, boundsMin, boundsMax );

}

// use a macro to hide the fact that we need to expand the struct into separate fields
#define	bvhClosestPointToPoint(		bvh,		point, faceIndices, faceNormal, barycoord, side, outPoint	)	_bvhClosestPointToPoint(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		point, faceIndices, faceNormal, barycoord, side, outPoint	)

float _bvhClosestPointToPoint(
	// bvh info
	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,

	// point to check
	vec3 point,

	// output variables
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout vec3 outPoint
 ) {

	// stack needs to be twice as long as the deepest tree we expect because
	// we push both the left and right child onto the stack every traversal
	int ptr = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	float closestDistanceSquared = pow( 100000.0, 2.0 );
	bool found = false;
	while ( ptr > - 1 && ptr < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ ptr ];
		ptr --;

		// check if we intersect the current bounds
		float boundsHitDistance = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, currNodeIndex );
		if ( boundsHitDistance > closestDistanceSquared ) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );
		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;
			closestDistanceSquared = distanceToTriangles(
				bvh_position, bvh_index, offset, count, point, closestDistanceSquared,

				// outputs
				faceIndices, faceNormal, barycoord, side, outPoint
			);

		} else {

			uint leftIndex = currNodeIndex + 1u;
			uint splitAxis = boundsInfo.x & 0x0000ffffu;
			uint rightIndex = boundsInfo.y;
			bool leftToRight = distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, leftIndex ) < distanceSqToBVHNodeBoundsPoint( point, bvh_bvhBounds, rightIndex );//rayDirection[ splitAxis ] >= 0.0;
			uint c1 = leftToRight ? leftIndex : rightIndex;
			uint c2 = leftToRight ? rightIndex : leftIndex;

			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in
			// the stack while we traverse. The second pointer added is the one that will be
			// traversed first
			ptr ++;
			stack[ ptr ] = c2;
			ptr ++;
			stack[ ptr ] = c1;

		}

	}

	return sqrt( closestDistanceSquared );

}
`;var yp=`

#ifndef TRI_INTERSECT_EPSILON
#define TRI_INTERSECT_EPSILON 1e-5
#endif

// Raycasting
bool intersectsBounds( vec3 rayOrigin, vec3 rayDirection, vec3 boundsMin, vec3 boundsMax, out float dist ) {

	// https://www.reddit.com/r/opengl/comments/8ntzz5/fast_glsl_ray_box_intersection/
	// https://tavianator.com/2011/ray_box.html
	vec3 invDir = 1.0 / rayDirection;

	// find intersection distances for each plane
	vec3 tMinPlane = invDir * ( boundsMin - rayOrigin );
	vec3 tMaxPlane = invDir * ( boundsMax - rayOrigin );

	// get the min and max distances from each intersection
	vec3 tMinHit = min( tMaxPlane, tMinPlane );
	vec3 tMaxHit = max( tMaxPlane, tMinPlane );

	// get the furthest hit distance
	vec2 t = max( tMinHit.xx, tMinHit.yz );
	float t0 = max( t.x, t.y );

	// get the minimum hit distance
	t = min( tMaxHit.xx, tMaxHit.yz );
	float t1 = min( t.x, t.y );

	// set distance to 0.0 if the ray starts inside the box
	dist = max( t0, 0.0 );

	return t1 >= dist;

}

bool intersectsTriangle(
	vec3 rayOrigin, vec3 rayDirection, vec3 a, vec3 b, vec3 c,
	out vec3 barycoord, out vec3 norm, out float dist, out float side
) {

	// https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d
	vec3 edge1 = b - a;
	vec3 edge2 = c - a;
	norm = cross( edge1, edge2 );

	float det = - dot( rayDirection, norm );
	float invdet = 1.0 / det;

	vec3 AO = rayOrigin - a;
	vec3 DAO = cross( AO, rayDirection );

	vec4 uvt;
	uvt.x = dot( edge2, DAO ) * invdet;
	uvt.y = - dot( edge1, DAO ) * invdet;
	uvt.z = dot( AO, norm ) * invdet;
	uvt.w = 1.0 - uvt.x - uvt.y;

	// set the hit information
	barycoord = uvt.wxy; // arranged in A, B, C order
	dist = uvt.z;
	side = sign( det );
	norm = side * normalize( norm );

	// add an epsilon to avoid misses between triangles
	uvt += vec4( TRI_INTERSECT_EPSILON );

	return all( greaterThanEqual( uvt, vec4( 0.0 ) ) );

}

bool intersectTriangles(
	// geometry info and triangle range
	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// outputs
	inout float minDistance, inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	bool found = false;
	vec3 localBarycoord, localNormal;
	float localDist, localSide;
	for ( uint i = offset, l = offset + count; i < l; i ++ ) {

		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;
		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;
		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;
		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;

		if (
			intersectsTriangle( rayOrigin, rayDirection, a, b, c, localBarycoord, localNormal, localDist, localSide )
			&& localDist < minDistance
		) {

			found = true;
			minDistance = localDist;

			faceIndices = uvec4( indices.xyz, i );
			faceNormal = localNormal;

			side = localSide;
			barycoord = localBarycoord;
			dist = localDist;

		}

	}

	return found;

}

bool intersectsBVHNodeBounds( vec3 rayOrigin, vec3 rayDirection, sampler2D bvhBounds, uint currNodeIndex, out float dist ) {

	uint cni2 = currNodeIndex * 2u;
	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;
	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;
	return intersectsBounds( rayOrigin, rayDirection, boundsMin, boundsMax, dist );

}

// use a macro to hide the fact that we need to expand the struct into separate fields
#define	bvhIntersectFirstHit(		bvh,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)	_bvhIntersectFirstHit(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)

bool _bvhIntersectFirstHit(
	// bvh info
	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// output variables split into separate variables due to output precision
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	// stack needs to be twice as long as the deepest tree we expect because
	// we push both the left and right child onto the stack every traversal
	int ptr = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	float triangleDistance = INFINITY;
	bool found = false;
	while ( ptr > - 1 && ptr < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ ptr ];
		ptr --;

		// check if we intersect the current bounds
		float boundsHitDistance;
		if (
			! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh_bvhBounds, currNodeIndex, boundsHitDistance )
			|| boundsHitDistance > triangleDistance
		) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );

		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;

			found = intersectTriangles(
				bvh_position, bvh_index, offset, count,
				rayOrigin, rayDirection, triangleDistance,
				faceIndices, faceNormal, barycoord, side, dist
			) || found;

		} else {

			uint leftIndex = currNodeIndex + 1u;
			uint splitAxis = boundsInfo.x & 0x0000ffffu;
			uint rightIndex = boundsInfo.y;

			bool leftToRight = rayDirection[ splitAxis ] >= 0.0;
			uint c1 = leftToRight ? leftIndex : rightIndex;
			uint c2 = leftToRight ? rightIndex : leftIndex;

			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in
			// the stack while we traverse. The second pointer added is the one that will be
			// traversed first
			ptr ++;
			stack[ ptr ] = c2;

			ptr ++;
			stack[ ptr ] = c1;

		}

	}

	return found;

}
`;var Ax=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`;var SR=`
	${_p}
	${yp}
`;function Nu(r,t,e=0){if(r.isInterleavedBufferAttribute){let n=r.itemSize;for(let i=0,s=r.count;i<s;i++){let o=i+e;t.setX(o,r.getX(i)),n>=2&&t.setY(o,r.getY(i)),n>=3&&t.setZ(o,r.getZ(i)),n>=4&&t.setW(o,r.getW(i))}}else{let n=t.array,i=n.constructor,s=n.BYTES_PER_ELEMENT*r.itemSize*e;new i(n.buffer,s,r.array.length).set(r.array)}}function Lr(r,t=null){let e=r.array.constructor,n=r.normalized,i=r.itemSize,s=t===null?r.count:t;return new Ft(new e(i*s),i,n)}function Yi(r,t){if(!r&&!t)return!0;if(!!r!=!!t)return!1;let e=r.count===t.count,n=r.normalized===t.normalized,i=r.array.constructor===t.array.constructor,s=r.itemSize===t.itemSize;return!(!e||!n||!i||!s)}function jw(r){let t=r[0].index!==null,e=new Set(Object.keys(r[0].attributes));if(!r[0].getAttribute("position"))throw new Error("StaticGeometryGenerator: position attribute is required.");for(let n=0;n<r.length;++n){let i=r[n],s=0;if(t!==(i.index!==null))throw new Error("StaticGeometryGenerator: All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");for(let o in i.attributes){if(!e.has(o))throw new Error('StaticGeometryGenerator: All geometries must have compatible attributes; make sure "'+o+'" attribute exists among all geometries, or in none of them.');s++}if(s!==e.size)throw new Error("StaticGeometryGenerator: All geometries must have the same number of attributes.")}}function t1(r){let t=0;for(let e=0,n=r.length;e<n;e++)t+=r[e].getIndex().count;return t}function e1(r){let t=0;for(let e=0,n=r.length;e<n;e++)t+=r[e].getAttribute("position").count;return t}function n1(r,t,e){r.index&&r.index.count!==t&&r.setIndex(null);let n=r.attributes;for(let i in n)n[i].count!==e&&r.deleteAttribute(i)}function Ex(r,t={},e=new Rt){let{useGroups:n=!1,forceUpdate:i=!1,skipAssigningAttributes:s=[],overwriteIndex:o=!0}=t;jw(r);let a=r[0].index!==null,c=a?t1(r):-1,l=e1(r);if(n1(e,c,l),n){let f=0;for(let u=0,d=r.length;u<d;u++){let g=r[u],x;a?x=g.getIndex().count:x=g.getAttribute("position").count,e.addGroup(f,x,u),f+=x}}if(a){let f=!1;if(e.index||(e.setIndex(new Ft(new Uint32Array(c),1,!1)),f=!0),f||o){let u=0,d=0,g=e.getIndex();for(let x=0,p=r.length;x<p;x++){let m=r[x],_=m.getIndex();if(!(!i&&!f&&s[x]))for(let y=0;y<_.count;++y)g.setX(u+y,_.getX(y)+d);u+=_.count,d+=m.getAttribute("position").count}}}let h=Object.keys(r[0].attributes);for(let f=0,u=h.length;f<u;f++){let d=!1,g=h[f];if(!e.getAttribute(g)){let m=r[0].getAttribute(g);e.setAttribute(g,Lr(m,l)),d=!0}let x=0,p=e.getAttribute(g);for(let m=0,_=r.length;m<_;m++){let v=r[m],y=!i&&!d&&s[m],w=v.getAttribute(g);y||Nu(w,p,x),x+=w.count}}}function Rx(r,t,e){let n=r.index,s=r.attributes.position.count,o=n?n.count:s,a=r.groups;a.length===0&&(a=[{count:o,start:0,materialIndex:0}]);let c=r.getAttribute("materialIndex");if(!c||c.count!==s){let h;e.length<=255?h=new Uint8Array(s):h=new Uint16Array(s),c=new Ft(h,1,!1),r.deleteAttribute("materialIndex"),r.setAttribute("materialIndex",c)}let l=c.array;for(let h=0;h<a.length;h++){let f=a[h],u=f.start,d=f.count,g=Math.min(d,o-u),x=Array.isArray(t)?t[f.materialIndex]:t,p=e.indexOf(x);for(let m=0;m<g;m++){let _=u+m;n&&(_=n.getX(_)),l[_]=p}}}function Cx(r,t){if(!r.index){let e=r.attributes.position.count,n=new Array(e);for(let i=0;i<e;i++)n[i]=i;r.setIndex(n)}if(!r.attributes.normal&&t&&t.includes("normal")&&r.computeVertexNormals(),!r.attributes.uv&&t&&t.includes("uv")){let e=r.attributes.position.count;r.setAttribute("uv",new Ft(new Float32Array(e*2),2,!1))}if(!r.attributes.uv2&&t&&t.includes("uv2")){let e=r.attributes.position.count;r.setAttribute("uv2",new Ft(new Float32Array(e*2),2,!1))}if(!r.attributes.tangent&&t&&t.includes("tangent"))if(r.attributes.uv&&r.attributes.normal)r.computeTangents();else{let e=r.attributes.position.count;r.setAttribute("tangent",new Ft(new Float32Array(e*4),4,!1))}if(!r.attributes.color&&t&&t.includes("color")){let e=r.attributes.position.count,n=new Float32Array(e*4);n.fill(1),r.setAttribute("color",new Ft(n,4))}}function Xs(r){let t=0;if(r.byteLength!==0){let e=new Uint8Array(r);for(let n=0;n<r.byteLength;n++){let i=e[n];t=(t<<5)-t+i,t|=0}}return t}function Ix(r){let t=r.uuid,e=Object.values(r.attributes);r.index&&(e.push(r.index),t+=`index|${r.index.version}`);let n=Object.keys(e).sort();for(let i of n){let s=e[i];t+=`${i}_${s.version}|`}return t}function Px(r){let t=r.skeleton;return t?(t.boneTexture||t.computeBoneTexture(),`${Xs(t.boneTexture.image.data.buffer)}_${t.boneTexture.uuid}`):null}var Uu=class{constructor(t=null){this.matrixWorld=new dt,this.geometryHash=null,this.skeletonHash=null,this.primitiveCount=-1,t!==null&&this.updateFrom(t)}updateFrom(t){let e=t.geometry,n=(e.index?e.index.count:e.attributes.position.count)/3;this.matrixWorld.copy(t.matrixWorld),this.geometryHash=Ix(e),this.primitiveCount=n,this.skeletonHash=Px(t)}didChange(t){let e=t.geometry,n=(e.index?e.index.count:e.attributes.position.count)/3;return!(this.matrixWorld.equals(t.matrixWorld)&&this.geometryHash===Ix(e)&&this.skeletonHash===Px(t)&&this.primitiveCount===n)}};var Fr=new R,Nr=new R,Ur=new R,Dx=new Kt,Bu=new R,bp=new R,Lx=new Kt,Fx=new Kt,Ou=new dt,Nx=new dt;function Ux(r,t,e){let n=r.skeleton,i=r.geometry,s=n.bones,o=n.boneInverses;Lx.fromBufferAttribute(i.attributes.skinIndex,t),Fx.fromBufferAttribute(i.attributes.skinWeight,t),Ou.elements.fill(0);for(let a=0;a<4;a++){let c=Fx.getComponent(a);if(c!==0){let l=Lx.getComponent(a);Nx.multiplyMatrices(s[l].matrixWorld,o[l]),i1(Ou,Nx,c)}}return Ou.multiply(r.bindMatrix).premultiply(r.bindMatrixInverse),e.transformDirection(Ou),e}function Mp(r,t,e,n,i){Bu.set(0,0,0);for(let s=0,o=r.length;s<o;s++){let a=t[s],c=r[s];a!==0&&(bp.fromBufferAttribute(c,n),e?Bu.addScaledVector(bp,a):Bu.addScaledVector(bp.sub(i),a))}i.add(Bu)}function i1(r,t,e){let n=r.elements,i=t.elements;for(let s=0,o=i.length;s<o;s++)n[s]+=i[s]*e}function r1(r){let{index:t,attributes:e}=r;if(t)for(let n=0,i=t.count;n<i;n+=3){let s=t.getX(n),o=t.getX(n+2);t.setX(n,o),t.setX(n+2,s)}else for(let n in e){let i=e[n],s=i.itemSize;for(let o=0,a=i.count;o<a;o+=3)for(let c=0;c<s;c++){let l=i.getComponent(o,c),h=i.getComponent(o+2,c);i.setComponent(o,c,h),i.setComponent(o+2,c,l)}}return r}function Bx(r,t={},e=new Rt){t={applyWorldTransforms:!0,attributes:[],...t};let n=r.geometry,i=t.applyWorldTransforms,s=t.attributes.includes("normal"),o=t.attributes.includes("tangent"),a=n.attributes,c=e.attributes;for(let _ in e.attributes)(!t.attributes.includes(_)||!(_ in n.attributes))&&e.deleteAttribute(_);!e.index&&n.index&&(e.index=n.index.clone()),c.position||e.setAttribute("position",Lr(a.position)),s&&!c.normal&&a.normal&&e.setAttribute("normal",Lr(a.normal)),o&&!c.tangent&&a.tangent&&e.setAttribute("tangent",Lr(a.tangent)),Yi(n.index,e.index),Yi(a.position,c.position),s&&Yi(a.normal,c.normal),o&&Yi(a.tangent,c.tangent);let l=a.position,h=s?a.normal:null,f=o?a.tangent:null,u=n.morphAttributes.position,d=n.morphAttributes.normal,g=n.morphAttributes.tangent,x=n.morphTargetsRelative,p=r.morphTargetInfluences,m=new Ht;m.getNormalMatrix(r.matrixWorld),n.index&&e.index.array.set(n.index.array);for(let _=0,v=a.position.count;_<v;_++)Fr.fromBufferAttribute(l,_),h&&Nr.fromBufferAttribute(h,_),f&&(Dx.fromBufferAttribute(f,_),Ur.fromBufferAttribute(f,_)),p&&(u&&Mp(u,p,x,_,Fr),d&&Mp(d,p,x,_,Nr),g&&Mp(g,p,x,_,Ur)),r.isSkinnedMesh&&(r.applyBoneTransform(_,Fr),h&&Ux(r,_,Nr),f&&Ux(r,_,Ur)),i&&Fr.applyMatrix4(r.matrixWorld),c.position.setXYZ(_,Fr.x,Fr.y,Fr.z),h&&(i&&Nr.applyNormalMatrix(m),c.normal.setXYZ(_,Nr.x,Nr.y,Nr.z)),f&&(i&&Ur.transformDirection(r.matrixWorld),c.tangent.setXYZW(_,Ur.x,Ur.y,Ur.z,Dx.w));for(let _ in t.attributes){let v=t.attributes[_];v==="position"||v==="tangent"||v==="normal"||!(v in a)||(c[v]||e.setAttribute(v,Lr(a[v])),Yi(a[v],c[v]),Nu(a[v],c[v]))}return r.matrixWorld.determinant()<0&&r1(e),e}var zu=class extends Rt{constructor(){super(),this.version=0,this.hash=null,this._diff=new Uu}isCompatible(t,e){let n=t.geometry;for(let i=0;i<e.length;i++){let s=e[i],o=n.attributes[s],a=this.attributes[s];if(o&&!Yi(o,a))return!1}return!0}updateFrom(t,e){let n=this._diff;return n.didChange(t)?(Bx(t,e,this),n.updateFrom(t),this.version++,this.hash=`${this.uuid}_${this.version}`,!0):!1}};var Vu=0,Sp=1,Tp=2;function s1(r,t){for(let e=0,n=r.length;e<n;e++)r[e].traverseVisible(s=>{s.isMesh&&t(s)})}function o1(r){let t=[];for(let e=0,n=r.length;e<n;e++){let i=r[e];Array.isArray(i.material)?t.push(...i.material):t.push(i.material)}return t}function a1(r,t,e){if(r.length===0){t.setIndex(null);let n=t.attributes;for(let i in n)t.deleteAttribute(i);for(let i in e.attributes)t.setAttribute(e.attributes[i],new Ft(new Float32Array(0),4,!1))}else Ex(r,e,t);for(let n in t.attributes)t.attributes[n].needsUpdate=!0}var ku=class{constructor(t){this.objects=null,this.useGroups=!0,this.applyWorldTransforms=!0,this.generateMissingAttributes=!0,this.overwriteIndex=!0,this.attributes=["position","normal","color","tangent","uv","uv2"],this._intermediateGeometry=new Map,this._geometryMergeSets=new WeakMap,this._mergeOrder=[],this._dummyMesh=null,this.setObjects(t||[])}_getDummyMesh(){if(!this._dummyMesh){let t=new mn,e=new Rt;e.setAttribute("position",new Ft(new Float32Array(9),3)),this._dummyMesh=new Zt(e,t)}return this._dummyMesh}_getMeshes(){let t=[];return s1(this.objects,e=>{t.push(e)}),t.sort((e,n)=>e.uuid>n.uuid?1:e.uuid<n.uuid?-1:0),t.length===0&&t.push(this._getDummyMesh()),t}_updateIntermediateGeometries(){let{_intermediateGeometry:t}=this,e=this._getMeshes(),n=new Set(t.keys()),i={attributes:this.attributes,applyWorldTransforms:this.applyWorldTransforms};for(let s=0,o=e.length;s<o;s++){let a=e[s],c=a.uuid;n.delete(c);let l=t.get(c);(!l||!l.isCompatible(a,this.attributes))&&(l&&l.dispose(),l=new zu,t.set(c,l)),l.updateFrom(a,i)&&this.generateMissingAttributes&&Cx(l,this.attributes)}n.forEach(s=>{t.delete(s)})}setObjects(t){Array.isArray(t)?this.objects=[...t]:this.objects=[t]}generate(t=new Rt){let{useGroups:e,overwriteIndex:n,_intermediateGeometry:i,_geometryMergeSets:s}=this,o=this._getMeshes(),a=[],c=[],l=s.get(t)||[];this._updateIntermediateGeometries();let h=!1;o.length!==l.length&&(h=!0);for(let u=0,d=o.length;u<d;u++){let g=o[u],x=i.get(g.uuid);c.push(x);let p=l[u];!p||p.uuid!==x.uuid?(a.push(!1),h=!0):p.version!==x.version?a.push(!1):a.push(!0)}a1(c,t,{useGroups:e,forceUpdate:h,skipAssigningAttributes:a,overwriteIndex:n}),h&&t.dispose(),s.set(t,c.map(u=>({version:u.version,uuid:u.uuid})));let f=Vu;return h?f=Tp:a.includes(!1)&&(f=Sp),{changeType:f,materials:o1(o),geometry:t}}};function c1(r){let t=new Set;for(let e=0,n=r.length;e<n;e++){let i=r[e];for(let s in i){let o=i[s];o&&o.isTexture&&t.add(o)}}return Array.from(t)}function l1(r){let t=[],e=new Set;for(let i=0,s=r.length;i<s;i++)r[i].traverse(o=>{o.visible&&(o.isRectAreaLight||o.isSpotLight||o.isPointLight||o.isDirectionalLight)&&(t.push(o),o.iesMap&&e.add(o.iesMap))});let n=Array.from(e).sort((i,s)=>i.uuid<s.uuid?1:i.uuid>s.uuid?-1:0);return{lights:t,iesTextures:n}}var Hu=class{get initialized(){return!!this.bvh}constructor(t){this.bvhOptions={},this.attributes=["position","normal","tangent","color","uv","uv2"],this.generateBVH=!0,this.bvh=null,this.geometry=new Rt,this.staticGeometryGenerator=new ku(t),this._bvhWorker=null,this._pendingGenerate=null,this._buildAsync=!1}setObjects(t){this.staticGeometryGenerator.setObjects(t)}setBVHWorker(t){this._bvhWorker=t}async generateAsync(t=null){if(!this._bvhWorker)throw new Error('PathTracingSceneGenerator: "setBVHWorker" must be called before "generateAsync" can be called.');if(this.bvh instanceof Promise)return this._pendingGenerate||(this._pendingGenerate=new Promise(async()=>(await this.bvh,this._pendingGenerate=null,this.generateAsync(t)))),this._pendingGenerate;{this._buildAsync=!0;let e=this.generate(t);return this._buildAsync=!1,e.bvh=this.bvh=await e.bvh,e}}generate(t=null){let{staticGeometryGenerator:e,geometry:n,attributes:i}=this,s=e.objects;e.attributes=i,s.forEach(f=>{f.traverse(u=>{u.isSkinnedMesh&&u.skeleton&&u.skeleton.update()})});let o=e.generate(n),a=o.materials,c=c1(a),{lights:l,iesTextures:h}=l1(s);if(o.changeType!==Vu&&Rx(n,a,a),this.generateBVH){if(this.bvh instanceof Promise)throw new Error("PathTracingSceneGenerator: BVH is already building asynchronously.");if(o.changeType===Tp){let f={strategy:2,maxLeafTris:1,indirect:!0,onProgress:t,...this.bvhOptions};this._buildAsync?this.bvh=this._bvhWorker.generate(n,f):this.bvh=new Pr(n,f)}else o.changeType===Sp&&this.bvh.refit()}return{bvhChanged:o.changeType!==Vu,bvh:this.bvh,lights:l,iesTextures:h,geometry:n,materials:a,textures:c,objects:s}}};var u1=new Fi(-1,1,1,-1,0,1),wp=class extends Rt{constructor(){super(),this.setAttribute("position",new yt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new yt([0,2,0,0,2,0],2))}},h1=new wp,Ke=class{constructor(t){this._mesh=new Zt(h1,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,u1)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}};var Pn=class extends Pe{set needsUpdate(t){super.needsUpdate=!0,this.dispatchEvent({type:"recompilation"})}constructor(t){super(t);for(let e in this.uniforms)Object.defineProperty(this,e,{get(){return this.uniforms[e].value},set(n){this.uniforms[e].value=n}})}setDefine(t,e=void 0){if(e==null){if(t in this.defines)return delete this.defines[t],this.needsUpdate=!0,!0}else if(this.defines[t]!==e)return this.defines[t]=e,this.needsUpdate=!0,!0;return!1}};var Gu=class extends Pn{constructor(t){super({blending:Ne,uniforms:{target1:{value:null},target2:{value:null},opacity:{value:1}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				uniform float opacity;

				uniform sampler2D target1;
				uniform sampler2D target2;

				varying vec2 vUv;

				void main() {

					vec4 color1 = texture2D( target1, vUv );
					vec4 color2 = texture2D( target2, vUv );

					float invOpacity = 1.0 - opacity;
					float totalAlpha = color1.a * invOpacity + color2.a * opacity;

					if ( color1.a != 0.0 || color2.a != 0.0 ) {

						gl_FragColor.rgb = color1.rgb * ( invOpacity * color1.a / totalAlpha ) + color2.rgb * ( opacity * color2.a / totalAlpha );
						gl_FragColor.a = totalAlpha;

					} else {

						gl_FragColor = vec4( 0.0 );

					}

				}`}),this.setValues(t)}};function Wu(r=1){let t="uint";return r>1&&(t="uvec"+r),`
		${t} sobolReverseBits( ${t} x ) {

			x = ( ( ( x & 0xaaaaaaaau ) >> 1 ) | ( ( x & 0x55555555u ) << 1 ) );
			x = ( ( ( x & 0xccccccccu ) >> 2 ) | ( ( x & 0x33333333u ) << 2 ) );
			x = ( ( ( x & 0xf0f0f0f0u ) >> 4 ) | ( ( x & 0x0f0f0f0fu ) << 4 ) );
			x = ( ( ( x & 0xff00ff00u ) >> 8 ) | ( ( x & 0x00ff00ffu ) << 8 ) );
			return ( ( x >> 16 ) | ( x << 16 ) );

		}

		${t} sobolHashCombine( uint seed, ${t} v ) {

			return seed ^ ( v + ${t}( ( seed << 6 ) + ( seed >> 2 ) ) );

		}

		${t} sobolLaineKarrasPermutation( ${t} x, ${t} seed ) {

			x += seed;
			x ^= x * 0x6c50b47cu;
			x ^= x * 0xb82f1e52u;
			x ^= x * 0xc7afe638u;
			x ^= x * 0x8d22f6e6u;
			return x;

		}

		${t} nestedUniformScrambleBase2( ${t} x, ${t} seed ) {

			x = sobolLaineKarrasPermutation( x, seed );
			x = sobolReverseBits( x );
			return x;

		}
	`}function Xu(r=1){let t="uint",e="float",n="",i=".r",s="1u";return r>1&&(t="uvec"+r,e="vec"+r,n=r+"",r===2?(i=".rg",s="uvec2( 1u, 2u )"):r===3?(i=".rgb",s="uvec3( 1u, 2u, 3u )"):(i="",s="uvec4( 1u, 2u, 3u, 4u )")),`

		${e} sobol${n}( int effect ) {

			uint seed = sobolGetSeed( sobolBounceIndex, uint( effect ) );
			uint index = sobolPathIndex;

			uint shuffle_seed = sobolHashCombine( seed, 0u );
			uint shuffled_index = nestedUniformScrambleBase2( sobolReverseBits( index ), shuffle_seed );
			${e} sobol_pt = sobolGetTexturePoint( shuffled_index )${i};
			${t} result = ${t}( sobol_pt * 16777216.0 );

			${t} seed2 = sobolHashCombine( seed, ${s} );
			result = nestedUniformScrambleBase2( result, seed2 );

			return SOBOL_FACTOR * ${e}( result >> 8 );

		}
	`}var qu=`

	// Utils
	const float SOBOL_FACTOR = 1.0 / 16777216.0;
	const uint SOBOL_MAX_POINTS = 256u * 256u;

	${Wu(1)}
	${Wu(2)}
	${Wu(3)}
	${Wu(4)}

	uint sobolHash( uint x ) {

		// finalizer from murmurhash3
		x ^= x >> 16;
		x *= 0x85ebca6bu;
		x ^= x >> 13;
		x *= 0xc2b2ae35u;
		x ^= x >> 16;
		return x;

	}

`,Ox=`

	const uint SOBOL_DIRECTIONS_1[ 32 ] = uint[ 32 ](
		0x80000000u, 0xc0000000u, 0xa0000000u, 0xf0000000u,
		0x88000000u, 0xcc000000u, 0xaa000000u, 0xff000000u,
		0x80800000u, 0xc0c00000u, 0xa0a00000u, 0xf0f00000u,
		0x88880000u, 0xcccc0000u, 0xaaaa0000u, 0xffff0000u,
		0x80008000u, 0xc000c000u, 0xa000a000u, 0xf000f000u,
		0x88008800u, 0xcc00cc00u, 0xaa00aa00u, 0xff00ff00u,
		0x80808080u, 0xc0c0c0c0u, 0xa0a0a0a0u, 0xf0f0f0f0u,
		0x88888888u, 0xccccccccu, 0xaaaaaaaau, 0xffffffffu
	);

	const uint SOBOL_DIRECTIONS_2[ 32 ] = uint[ 32 ](
		0x80000000u, 0xc0000000u, 0x60000000u, 0x90000000u,
		0xe8000000u, 0x5c000000u, 0x8e000000u, 0xc5000000u,
		0x68800000u, 0x9cc00000u, 0xee600000u, 0x55900000u,
		0x80680000u, 0xc09c0000u, 0x60ee0000u, 0x90550000u,
		0xe8808000u, 0x5cc0c000u, 0x8e606000u, 0xc5909000u,
		0x6868e800u, 0x9c9c5c00u, 0xeeee8e00u, 0x5555c500u,
		0x8000e880u, 0xc0005cc0u, 0x60008e60u, 0x9000c590u,
		0xe8006868u, 0x5c009c9cu, 0x8e00eeeeu, 0xc5005555u
	);

	const uint SOBOL_DIRECTIONS_3[ 32 ] = uint[ 32 ](
		0x80000000u, 0xc0000000u, 0x20000000u, 0x50000000u,
		0xf8000000u, 0x74000000u, 0xa2000000u, 0x93000000u,
		0xd8800000u, 0x25400000u, 0x59e00000u, 0xe6d00000u,
		0x78080000u, 0xb40c0000u, 0x82020000u, 0xc3050000u,
		0x208f8000u, 0x51474000u, 0xfbea2000u, 0x75d93000u,
		0xa0858800u, 0x914e5400u, 0xdbe79e00u, 0x25db6d00u,
		0x58800080u, 0xe54000c0u, 0x79e00020u, 0xb6d00050u,
		0x800800f8u, 0xc00c0074u, 0x200200a2u, 0x50050093u
	);

	const uint SOBOL_DIRECTIONS_4[ 32 ] = uint[ 32 ](
		0x80000000u, 0x40000000u, 0x20000000u, 0xb0000000u,
		0xf8000000u, 0xdc000000u, 0x7a000000u, 0x9d000000u,
		0x5a800000u, 0x2fc00000u, 0xa1600000u, 0xf0b00000u,
		0xda880000u, 0x6fc40000u, 0x81620000u, 0x40bb0000u,
		0x22878000u, 0xb3c9c000u, 0xfb65a000u, 0xddb2d000u,
		0x78022800u, 0x9c0b3c00u, 0x5a0fb600u, 0x2d0ddb00u,
		0xa2878080u, 0xf3c9c040u, 0xdb65a020u, 0x6db2d0b0u,
		0x800228f8u, 0x400b3cdcu, 0x200fb67au, 0xb00ddb9du
	);

	uint getMaskedSobol( uint index, uint directions[ 32 ] ) {

		uint X = 0u;
		for ( int bit = 0; bit < 32; bit ++ ) {

			uint mask = ( index >> bit ) & 1u;
			X ^= mask * directions[ bit ];

		}
		return X;

	}

	vec4 generateSobolPoint( uint index ) {

		if ( index >= SOBOL_MAX_POINTS ) {

			return vec4( 0.0 );

		}

		// NOTE: this sobol "direction" is also available but we can't write out 5 components
		// uint x = index & 0x00ffffffu;
		uint x = sobolReverseBits( getMaskedSobol( index, SOBOL_DIRECTIONS_1 ) ) & 0x00ffffffu;
		uint y = sobolReverseBits( getMaskedSobol( index, SOBOL_DIRECTIONS_2 ) ) & 0x00ffffffu;
		uint z = sobolReverseBits( getMaskedSobol( index, SOBOL_DIRECTIONS_3 ) ) & 0x00ffffffu;
		uint w = sobolReverseBits( getMaskedSobol( index, SOBOL_DIRECTIONS_4 ) ) & 0x00ffffffu;

		return vec4( x, y, z, w ) * SOBOL_FACTOR;

	}

`,zx=`

	// Seeds
	uniform sampler2D sobolTexture;
	uint sobolPixelIndex = 0u;
	uint sobolPathIndex = 0u;
	uint sobolBounceIndex = 0u;

	uint sobolGetSeed( uint bounce, uint effect ) {

		return sobolHash(
			sobolHashCombine(
				sobolHashCombine(
					sobolHash( bounce ),
					sobolPixelIndex
				),
				effect
			)
		);

	}

	vec4 sobolGetTexturePoint( uint index ) {

		if ( index >= SOBOL_MAX_POINTS ) {

			index = index % SOBOL_MAX_POINTS;

		}

		uvec2 dim = uvec2( textureSize( sobolTexture, 0 ).xy );
		uint y = index / dim.x;
		uint x = index - y * dim.x;
		vec2 uv = vec2( x, y ) / vec2( dim );
		return texture( sobolTexture, uv );

	}

	${Xu(1)}
	${Xu(2)}
	${Xu(3)}
	${Xu(4)}

`;var Ap=class extends Pn{constructor(){super({blending:Ne,uniforms:{resolution:{value:new X}},vertexShader:`

				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`

				${qu}
				${Ox}

				varying vec2 vUv;
				uniform vec2 resolution;
				void main() {

					uint index = uint( gl_FragCoord.y ) * uint( resolution.x ) + uint( gl_FragCoord.x );
					gl_FragColor = generateSobolPoint( index );

				}
			`})}},Yu=class{generate(t,e=256){let n=new be(e,e,{type:Dt,format:Lt,minFilter:Nt,magFilter:Nt,generateMipmaps:!1}),i=t.getRenderTarget();t.setRenderTarget(n);let s=new Ke(new Ap);return s.material.resolution.set(e,e),s.render(t),t.setRenderTarget(i),s.dispose(),n}};var qs=class extends _e{set bokehSize(t){this.fStop=this.getFocalLength()/t}get bokehSize(){return this.getFocalLength()/this.fStop}constructor(...t){super(...t),this.fStop=1.4,this.apertureBlades=0,this.apertureRotation=0,this.focusDistance=25,this.anamorphicRatio=1}copy(t,e){return super.copy(t,e),this.fStop=t.fStop,this.apertureBlades=t.apertureBlades,this.apertureRotation=t.apertureRotation,this.focusDistance=t.focusDistance,this.anamorphicRatio=t.anamorphicRatio,this}};var $u=class{constructor(){this.bokehSize=0,this.apertureBlades=0,this.apertureRotation=0,this.focusDistance=10,this.anamorphicRatio=1}updateFrom(t){t instanceof qs?(this.bokehSize=t.bokehSize,this.apertureBlades=t.apertureBlades,this.apertureRotation=t.apertureRotation,this.focusDistance=t.focusDistance,this.anamorphicRatio=t.anamorphicRatio):(this.bokehSize=0,this.apertureRotation=0,this.apertureBlades=0,this.focusDistance=10,this.anamorphicRatio=1)}};function Zu(r){let t=new Uint16Array(r.length);for(let e=0,n=r.length;e<n;++e)t[e]=Oe.toHalfFloat(r[e]);return t}function kx(r,t,e=0,n=r.length){let i=e,s=e+n-1;for(;i<s;){let o=i+s>>1;r[o]<t?i=o+1:s=o}return i-e}function f1(r,t,e){return .2126*r+.7152*t+.0722*e}function d1(r,t=me){let e=r.clone();e.source=new Bn({...e.image});let{width:n,height:i,data:s}=e.image,o=s;if(e.type!==t){t===me?o=new Uint16Array(s.length):o=new Float32Array(s.length);let a;s instanceof Int8Array||s instanceof Int16Array||s instanceof Int32Array?a=2**(8*s.BYTES_PER_ELEMENT-1)-1:a=2**(8*s.BYTES_PER_ELEMENT)-1;for(let c=0,l=s.length;c<l;c++){let h=s[c];e.type===me&&(h=Oe.fromHalfFloat(s[c])),e.type!==Dt&&e.type!==me&&(h/=a),t===me&&(o[c]=Oe.toHalfFloat(h))}e.image.data=o,e.type=t}if(e.flipY){let a=o;o=o.slice();for(let c=0;c<i;c++)for(let l=0;l<n;l++){let h=i-c-1,f=4*(c*n+l),u=4*(h*n+l);o[u+0]=a[f+0],o[u+1]=a[f+1],o[u+2]=a[f+2],o[u+3]=a[f+3]}e.flipY=!1,e.image.data=o}return e}var Ju=class{constructor(){let t=new jt(Zu(new Float32Array([0,0,0,0])),1,1);t.type=me,t.format=Lt,t.minFilter=Qt,t.magFilter=Qt,t.wrapS=$e,t.wrapT=$e,t.generateMipmaps=!1,t.needsUpdate=!0;let e=new jt(Zu(new Float32Array([0,1])),1,2);e.type=me,e.format=Gn,e.minFilter=Qt,e.magFilter=Qt,e.generateMipmaps=!1,e.needsUpdate=!0;let n=new jt(Zu(new Float32Array([0,0,1,1])),2,2);n.type=me,n.format=Gn,n.minFilter=Qt,n.magFilter=Qt,n.generateMipmaps=!1,n.needsUpdate=!0,this.map=t,this.marginalWeights=e,this.conditionalWeights=n,this.totalSum=0}dispose(){this.marginalWeights.dispose(),this.conditionalWeights.dispose(),this.map.dispose()}updateFrom(t){let e=d1(t);e.wrapS=$e,e.wrapT=ge;let{width:n,height:i,data:s}=e.image,o=new Float32Array(n*i),a=new Float32Array(n*i),c=new Float32Array(i),l=new Float32Array(i),h=0,f=0;for(let p=0;p<i;p++){let m=0;for(let _=0;_<n;_++){let v=p*n+_,y=Oe.fromHalfFloat(s[4*v+0]),w=Oe.fromHalfFloat(s[4*v+1]),S=Oe.fromHalfFloat(s[4*v+2]),T=f1(y,w,S);m+=T,h+=T,o[v]=T,a[v]=m}if(m!==0)for(let _=p*n,v=p*n+n;_<v;_++)o[_]/=m,a[_]/=m;f+=m,c[p]=m,l[p]=f}if(f!==0)for(let p=0,m=c.length;p<m;p++)c[p]/=f,l[p]/=f;let u=new Uint16Array(i),d=new Uint16Array(n*i);for(let p=0;p<i;p++){let m=(p+1)/i,_=kx(l,m);u[p]=Oe.toHalfFloat((_+.5)/i)}for(let p=0;p<i;p++)for(let m=0;m<n;m++){let _=p*n+m,v=(m+1)/n,y=kx(a,v,p*n,n);d[_]=Oe.toHalfFloat((y+.5)/n)}this.dispose();let{marginalWeights:g,conditionalWeights:x}=this;g.image={width:i,height:1,data:u},g.needsUpdate=!0,x.image={width:n,height:i,data:d},x.needsUpdate=!0,this.totalSum=h,this.map=e}};var Ep=6,p1=0,m1=1,g1=2,x1=3,v1=4,qn=new R,xn=new R,Vx=new dt,Ys=new Ge,Hx=new R,$s=new R,_1=new R(0,1,0),Ku=class{constructor(){let t=new jt(new Float32Array(4),1,1);t.format=Lt,t.type=Dt,t.wrapS=ge,t.wrapT=ge,t.generateMipmaps=!1,t.minFilter=Nt,t.magFilter=Nt,this.tex=t,this.count=0}updateFrom(t,e=[]){let n=this.tex,i=Math.max(t.length*Ep,1),s=Math.ceil(Math.sqrt(i));n.image.width!==s&&(n.dispose(),n.image.data=new Float32Array(s*s*4),n.image.width=s,n.image.height=s);let o=n.image.data;for(let c=0,l=t.length;c<l;c++){let h=t[c],f=c*Ep*4,u=0;for(let g=0;g<Ep*4;g++)o[f+g]=0;h.getWorldPosition(xn),o[f+u++]=xn.x,o[f+u++]=xn.y,o[f+u++]=xn.z;let d=p1;if(h.isRectAreaLight&&h.isCircular?d=m1:h.isSpotLight?d=g1:h.isDirectionalLight?d=x1:h.isPointLight&&(d=v1),o[f+u++]=d,o[f+u++]=h.color.r,o[f+u++]=h.color.g,o[f+u++]=h.color.b,o[f+u++]=h.intensity,h.getWorldQuaternion(Ys),h.isRectAreaLight)qn.set(h.width,0,0).applyQuaternion(Ys),o[f+u++]=qn.x,o[f+u++]=qn.y,o[f+u++]=qn.z,u++,xn.set(0,h.height,0).applyQuaternion(Ys),o[f+u++]=xn.x,o[f+u++]=xn.y,o[f+u++]=xn.z,o[f+u++]=qn.cross(xn).length()*(h.isCircular?Math.PI/4:1);else if(h.isSpotLight){let g=h.radius||0;Hx.setFromMatrixPosition(h.matrixWorld),$s.setFromMatrixPosition(h.target.matrixWorld),Vx.lookAt(Hx,$s,_1),Ys.setFromRotationMatrix(Vx),qn.set(1,0,0).applyQuaternion(Ys),o[f+u++]=qn.x,o[f+u++]=qn.y,o[f+u++]=qn.z,u++,xn.set(0,1,0).applyQuaternion(Ys),o[f+u++]=xn.x,o[f+u++]=xn.y,o[f+u++]=xn.z,o[f+u++]=Math.PI*g*g,o[f+u++]=g,o[f+u++]=h.decay,o[f+u++]=h.distance,o[f+u++]=Math.cos(h.angle),o[f+u++]=Math.cos(h.angle*(1-h.penumbra)),o[f+u++]=h.iesMap?e.indexOf(h.iesMap):-1}else if(h.isPointLight){let g=qn.setFromMatrixPosition(h.matrixWorld);o[f+u++]=g.x,o[f+u++]=g.y,o[f+u++]=g.z,u++,u+=4,u+=1,o[f+u++]=h.decay,o[f+u++]=h.distance}else if(h.isDirectionalLight){let g=qn.setFromMatrixPosition(h.matrixWorld),x=xn.setFromMatrixPosition(h.target.matrixWorld);$s.subVectors(g,x).normalize(),o[f+u++]=$s.x,o[f+u++]=$s.y,o[f+u++]=$s.z}}this.count=t.length;let a=Xs(o.buffer);return this.hash!==a?(this.hash=a,n.needsUpdate=!0,!0):!1}};function Gx(r,t,e,n,i){if(t>n)throw new Error;let s=r.length/t,o=r.constructor.BYTES_PER_ELEMENT*8,a=1;switch(r.constructor){case Uint8Array:case Uint16Array:case Uint32Array:a=2**o-1;break;case Int8Array:case Int16Array:case Int32Array:a=2**(o-1)-1;break}for(let c=0;c<s;c++){let l=4*c,h=t*c;for(let f=0;f<n;f++)e[i+l+f]=t>=f+1?r[h+f]/a:0}}var Qu=class extends Pi{constructor(){super(),this._textures=[],this.type=Dt,this.format=Lt,this.internalFormat="RGBA32F"}updateAttribute(t,e){let n=this._textures[t];n.updateFrom(e);let i=n.image,s=this.image;if(i.width!==s.width||i.height!==s.height)throw new Error("FloatAttributeTextureArray: Attribute must be the same dimensions when updating single layer.");let{width:o,height:a,data:c}=s,h=o*a*4*t,f=e.itemSize;f===3&&(f=4),Gx(n.image.data,f,c,4,h),this.dispose(),this.needsUpdate=!0}setAttributes(t){let e=t[0].count,n=t.length;for(let f=0,u=n;f<u;f++)if(t[f].count!==e)throw new Error("FloatAttributeTextureArray: All attributes must have the same item count.");let i=this._textures;for(;i.length<n;){let f=new Ws;i.push(f)}for(;i.length>n;)i.pop();for(let f=0,u=n;f<u;f++)i[f].updateFrom(t[f]);let o=i[0].image,a=this.image;(o.width!==a.width||o.height!==a.height||o.depth!==n)&&(a.width=o.width,a.height=o.height,a.depth=n,a.data=new Float32Array(a.width*a.height*a.depth*4));let{data:c,width:l,height:h}=a;for(let f=0,u=n;f<u;f++){let d=i[f],x=l*h*4*f,p=t[f].itemSize;p===3&&(p=4),Gx(d.image.data,p,c,4,x)}this.dispose(),this.needsUpdate=!0}};var ju=class extends Qu{updateNormalAttribute(t){this.updateAttribute(0,t)}updateTangentAttribute(t){this.updateAttribute(1,t)}updateUvAttribute(t){this.updateAttribute(2,t)}updateColorAttribute(t){this.updateAttribute(3,t)}updateFrom(t,e,n,i){this.setAttributes([t,e,n,i])}};function Rp(r,t){return r.uuid<t.uuid?1:r.uuid>t.uuid?-1:0}function th(r){return`${r.source.uuid}:${r.colorSpace}`}function y1(r){let t=new Set,e=[];for(let n=0,i=r.length;n<i;n++){let s=r[n],o=th(s);t.has(o)||(t.add(o),e.push(s))}return e}function Wx(r){let t=r.map(n=>n.iesMap||null).filter(n=>n),e=new Set(t);return Array.from(e).sort(Rp)}function Xx(r){let t=new Set;for(let n=0,i=r.length;n<i;n++){let s=r[n];for(let o in s){let a=s[o];a&&a.isTexture&&t.add(a)}}let e=Array.from(t);return y1(e).sort(Rp)}function qx(r){let t=[];return r.traverse(e=>{e.visible&&(e.isRectAreaLight||e.isSpotLight||e.isPointLight||e.isDirectionalLight)&&t.push(e)}),t.sort(Rp)}var $x=45,Yx=$x*4,Cp=class{constructor(){this._features={}}isUsed(t){return t in this._features}setUsed(t,e=!0){e===!1?delete this._features[t]:this._features[t]=!0}reset(){this._features={}}},eh=class extends jt{constructor(){super(new Float32Array(4),1,1),this.format=Lt,this.type=Dt,this.wrapS=ge,this.wrapT=ge,this.minFilter=Nt,this.magFilter=Nt,this.generateMipmaps=!1,this.features=new Cp}updateFrom(t,e){function n(g,x,p=-1){if(x in g&&g[x]){let m=th(g[x]);return f[m]}else return p}function i(g,x,p){return x in g?g[x]:p}function s(g,x,p,m){let _=g[x]&&g[x].isTexture?g[x]:null;if(_){_.matrixAutoUpdate&&_.updateMatrix();let v=_.matrix.elements,y=0;p[m+y++]=v[0],p[m+y++]=v[3],p[m+y++]=v[6],y++,p[m+y++]=v[1],p[m+y++]=v[4],p[m+y++]=v[7],y++}return 8}let o=0,a=t.length*$x,c=Math.ceil(Math.sqrt(a))||1,{image:l,features:h}=this,f={};for(let g=0,x=e.length;g<x;g++)f[th(e[g])]=g;l.width!==c&&(this.dispose(),l.data=new Float32Array(c*c*4),l.width=c,l.height=c);let u=l.data;h.reset();for(let g=0,x=t.length;g<x;g++){let p=t[g];if(p.isFogVolumeMaterial){h.setUsed("FOG");for(let v=0;v<Yx;v++)u[o+v]=0;u[o+0*4+0]=p.color.r,u[o+0*4+1]=p.color.g,u[o+0*4+2]=p.color.b,u[o+2*4+3]=i(p,"emissiveIntensity",0),u[o+3*4+0]=p.emissive.r,u[o+3*4+1]=p.emissive.g,u[o+3*4+2]=p.emissive.b,u[o+13*4+1]=p.density,u[o+13*4+3]=0,u[o+14*4+2]=4,o+=Yx;continue}u[o++]=p.color.r,u[o++]=p.color.g,u[o++]=p.color.b,u[o++]=n(p,"map"),u[o++]=i(p,"metalness",0),u[o++]=n(p,"metalnessMap"),u[o++]=i(p,"roughness",0),u[o++]=n(p,"roughnessMap"),u[o++]=i(p,"ior",1.5),u[o++]=i(p,"transmission",0),u[o++]=n(p,"transmissionMap"),u[o++]=i(p,"emissiveIntensity",0),"emissive"in p?(u[o++]=p.emissive.r,u[o++]=p.emissive.g,u[o++]=p.emissive.b):(u[o++]=0,u[o++]=0,u[o++]=0),u[o++]=n(p,"emissiveMap"),u[o++]=n(p,"normalMap"),"normalScale"in p?(u[o++]=p.normalScale.x,u[o++]=p.normalScale.y):(u[o++]=1,u[o++]=1),u[o++]=i(p,"clearcoat",0),u[o++]=n(p,"clearcoatMap"),u[o++]=i(p,"clearcoatRoughness",0),u[o++]=n(p,"clearcoatRoughnessMap"),u[o++]=n(p,"clearcoatNormalMap"),"clearcoatNormalScale"in p?(u[o++]=p.clearcoatNormalScale.x,u[o++]=p.clearcoatNormalScale.y):(u[o++]=1,u[o++]=1),o++,u[o++]=i(p,"sheen",0),"sheenColor"in p?(u[o++]=p.sheenColor.r,u[o++]=p.sheenColor.g,u[o++]=p.sheenColor.b):(u[o++]=0,u[o++]=0,u[o++]=0),u[o++]=n(p,"sheenColorMap"),u[o++]=i(p,"sheenRoughness",0),u[o++]=n(p,"sheenRoughnessMap"),u[o++]=n(p,"iridescenceMap"),u[o++]=n(p,"iridescenceThicknessMap"),u[o++]=i(p,"iridescence",0),u[o++]=i(p,"iridescenceIOR",1.3);let m=i(p,"iridescenceThicknessRange",[100,400]);u[o++]=m[0],u[o++]=m[1],"specularColor"in p?(u[o++]=p.specularColor.r,u[o++]=p.specularColor.g,u[o++]=p.specularColor.b):(u[o++]=1,u[o++]=1,u[o++]=1),u[o++]=n(p,"specularColorMap"),u[o++]=i(p,"specularIntensity",1),u[o++]=n(p,"specularIntensityMap");let _=i(p,"thickness",0)===0&&i(p,"attenuationDistance",1/0)===1/0;if(u[o++]=Number(_),o++,"attenuationColor"in p?(u[o++]=p.attenuationColor.r,u[o++]=p.attenuationColor.g,u[o++]=p.attenuationColor.b):(u[o++]=1,u[o++]=1,u[o++]=1),u[o++]=i(p,"attenuationDistance",1/0),u[o++]=n(p,"alphaMap"),u[o++]=p.opacity,u[o++]=p.alphaTest,!_&&p.transmission>0)u[o++]=0;else switch(p.side){case pn:u[o++]=1;break;case Ie:u[o++]=-1;break;case dn:u[o++]=0;break}u[o++]=Number(i(p,"matte",!1)),u[o++]=Number(i(p,"castShadow",!0)),u[o++]=Number(p.vertexColors)|Number(p.flatShading)<<1,u[o++]=Number(p.transparent),o+=s(p,"map",u,o),o+=s(p,"metalnessMap",u,o),o+=s(p,"roughnessMap",u,o),o+=s(p,"transmissionMap",u,o),o+=s(p,"emissiveMap",u,o),o+=s(p,"normalMap",u,o),o+=s(p,"clearcoatMap",u,o),o+=s(p,"clearcoatNormalMap",u,o),o+=s(p,"clearcoatRoughnessMap",u,o),o+=s(p,"sheenColorMap",u,o),o+=s(p,"sheenRoughnessMap",u,o),o+=s(p,"iridescenceMap",u,o),o+=s(p,"iridescenceThicknessMap",u,o),o+=s(p,"specularColorMap",u,o),o+=s(p,"specularIntensityMap",u,o)}let d=Xs(u.buffer);return this.hash!==d?(this.hash=d,this.needsUpdate=!0,!0):!1}};var Zx=new at;function b1(r){return r?`${r.uuid}:${r.version}`:null}function M1(r,t){for(let e in t)e in r&&(r[e]=t[e])}var Ta=class extends Bo{constructor(t,e,n){let i={format:Lt,type:cn,minFilter:Qt,magFilter:Qt,wrapS:$e,wrapT:$e,generateMipmaps:!1,...n};super(t,e,1,i),M1(this.texture,i),this.texture.setTextures=(...o)=>{this.setTextures(...o)},this.hashes=[null];let s=new Ke(new Ip);this.fsQuad=s}setTextures(t,e,n=this.width,i=this.height){let s=t.getRenderTarget(),o=t.toneMapping,a=t.getClearAlpha();t.getClearColor(Zx);let c=e.length||1;(n!==this.width||i!==this.height||this.depth!==c)&&(this.setSize(n,i,c),this.hashes=new Array(c).fill(null)),t.setClearColor(0,0),t.toneMapping=zn;let l=this.fsQuad,h=this.hashes,f=!1;for(let u=0,d=c;u<d;u++){let g=e[u],x=b1(g);g&&(h[u]!==x||g.isWebGLRenderTarget)&&(g.matrixAutoUpdate=!1,g.matrix.identity(),l.material.map=g,t.setRenderTarget(this,u),l.render(t),g.updateMatrix(),g.matrixAutoUpdate=!0,h[u]=x,f=!0)}return l.material.map=null,t.setClearColor(Zx,a),t.setRenderTarget(s),t.toneMapping=o,f}dispose(){super.dispose(),this.fsQuad.dispose()}},Ip=class extends Pe{get map(){return this.uniforms.map.value}set map(t){this.uniforms.map.value=t}constructor(){super({uniforms:{map:{value:null}},vertexShader:`
				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D map;
				varying vec2 vUv;
				void main() {

					gl_FragColor = texture2D( map, vUv );

				}
			`})}};function S1(r,t=Math.random()){for(let e=r.length-1;e>0;e--){let n=Math.floor(t()*(e+1)),i=r[e];r[e]=r[n],r[n]=i}return r}var nh=class{constructor(t,e,n=Math.random){let i=t**e,s=new Uint16Array(i),o=i;for(let a=0;a<i;a++)s[a]=a;this.samples=new Float32Array(e),this.strataCount=t,this.reset=function(){for(let a=0;a<i;a++)s[a]=a;o=0},this.reshuffle=function(){o=0},this.next=function(){let{samples:a}=this;o>=s.length&&(S1(s,n),this.reshuffle());let c=s[o++];for(let l=0;l<e;l++)a[l]=(c%t+n())/t,c=Math.floor(c/t);return a}}};var ih=class{constructor(t,e,n=Math.random){let i=0;for(let c of e)i+=c;let s=new Float32Array(i),o=[],a=0;for(let c of e){let l=new nh(t,c,n);l.samples=new Float32Array(s.buffer,a,l.samples.length),a+=l.samples.length*4,o.push(l)}this.samples=s,this.strataCount=t,this.next=function(){for(let c of o)c.next();return s},this.reshuffle=function(){for(let c of o)c.reshuffle()},this.reset=function(){for(let c of o)c.reset()}}};var Pp=class{constructor(t=0){this.m=2147483648,this.a=1103515245,this.c=12345,this.seed=t}nextInt(){return this.seed=(this.a*this.seed+this.c)%this.m,this.seed}nextFloat(){return this.nextInt()/(this.m-1)}},rh=class extends jt{constructor(t=1,e=1,n=8){super(new Float32Array(1),1,1,Lt,Dt),this.minFilter=Nt,this.magFilter=Nt,this.strata=n,this.sampler=null,this.generator=new Pp,this.stableNoise=!1,this.random=()=>this.stableNoise?this.generator.nextFloat():Math.random(),this.init(t,e,n)}init(t=this.image.height,e=this.image.width,n=this.strata){let{image:i}=this;if(i.width===e&&i.height===t&&this.sampler!==null)return;let s=new Array(t*e).fill(4),o=new ih(n,s,this.random);i.width=e,i.height=t,i.data=o.samples,this.sampler=o,this.dispose(),this.next()}next(){this.sampler.next(),this.needsUpdate=!0}reset(){this.sampler.reset(),this.generator.seed=0}};function Jx(r,t=Math.random){for(let e=r.length-1;e>0;e--){let n=~~((t()-1e-6)*e),i=r[e];r[e]=r[n],r[n]=i}}function Kx(r,t){r.fill(0);for(let e=0;e<t;e++)r[e]=1}var wa=class{constructor(t){this.count=0,this.size=-1,this.sigma=-1,this.radius=-1,this.lookupTable=null,this.score=null,this.binaryPattern=null,this.resize(t),this.setSigma(1.5)}findVoid(){let{score:t,binaryPattern:e}=this,n=1/0,i=-1;for(let s=0,o=e.length;s<o;s++){if(e[s]!==0)continue;let a=t[s];a<n&&(n=a,i=s)}return i}findCluster(){let{score:t,binaryPattern:e}=this,n=-1/0,i=-1;for(let s=0,o=e.length;s<o;s++){if(e[s]!==1)continue;let a=t[s];a>n&&(n=a,i=s)}return i}setSigma(t){if(t===this.sigma)return;let e=~~(Math.sqrt(10*2*t**2)+1),n=2*e+1,i=new Float32Array(n*n),s=t*t;for(let o=-e;o<=e;o++)for(let a=-e;a<=e;a++){let c=(e+a)*n+o+e,l=o*o+a*a;i[c]=Math.E**(-l/(2*s))}this.lookupTable=i,this.sigma=t,this.radius=e}resize(t){this.size!==t&&(this.size=t,this.score=new Float32Array(t*t),this.binaryPattern=new Uint8Array(t*t))}invert(){let{binaryPattern:t,score:e,size:n}=this;e.fill(0);for(let i=0,s=t.length;i<s;i++)if(t[i]===0){let o=~~(i/n),a=i-o*n;this.updateScore(a,o,1),t[i]=1}else t[i]=0}updateScore(t,e,n){let{size:i,score:s,lookupTable:o}=this,a=this.radius,c=2*a+1;for(let l=-a;l<=a;l++)for(let h=-a;h<=a;h++){let f=(a+h)*c+l+a,u=o[f],d=t+l;d=d<0?i+d:d%i;let g=e+h;g=g<0?i+g:g%i;let x=g*i+d;s[x]+=n*u}}addPointIndex(t){this.binaryPattern[t]=1;let e=this.size,n=~~(t/e),i=t-n*e;this.updateScore(i,n,1),this.count++}removePointIndex(t){this.binaryPattern[t]=0;let e=this.size,n=~~(t/e),i=t-n*e;this.updateScore(i,n,-1),this.count--}copy(t){this.resize(t.size),this.score.set(t.score),this.binaryPattern.set(t.binaryPattern),this.setSigma(t.sigma),this.count=t.count}};var sh=class{constructor(){this.random=Math.random,this.sigma=1.5,this.size=64,this.majorityPointsRatio=.1,this.samples=new wa(1),this.savedSamples=new wa(1)}generate(){let{samples:t,savedSamples:e,sigma:n,majorityPointsRatio:i,size:s}=this;t.resize(s),t.setSigma(n);let o=Math.floor(s*s*i),a=t.binaryPattern;Kx(a,o),Jx(a,this.random);for(let f=0,u=a.length;f<u;f++)a[f]===1&&t.addPointIndex(f);for(;;){let f=t.findCluster();t.removePointIndex(f);let u=t.findVoid();if(f===u){t.addPointIndex(f);break}t.addPointIndex(u)}let c=new Uint32Array(s*s);e.copy(t);let l;for(l=t.count-1;l>=0;){let f=t.findCluster();t.removePointIndex(f),c[f]=l,l--}let h=s*s;for(l=e.count;l<h/2;){let f=e.findVoid();e.addPointIndex(f),c[f]=l,l++}for(e.invert();l<h;){let f=e.findCluster();e.removePointIndex(f),c[f]=l,l++}return{data:c,maxValue:h}}};function T1(r){return r>=3?4:r}function w1(r){switch(r){case 1:return Gn;case 2:return Ir;default:return Lt}}var oh=class extends jt{constructor(t=64,e=1){super(new Float32Array(4),1,1,Lt,Dt),this.minFilter=Nt,this.magFilter=Nt,this.size=t,this.channels=e,this.update()}update(){let t=this.channels,e=this.size,n=new sh;n.channels=t,n.size=e;let i=T1(t),s=w1(i);(this.image.width!==e||s!==this.format)&&(this.image.width=e,this.image.height=e,this.image.data=new Float32Array(e**2*i),this.format=s,this.dispose());let o=this.image.data;for(let a=0,c=t;a<c;a++){let l=n.generate(),h=l.data,f=l.maxValue;for(let u=0,d=h.length;u<d;u++){let g=h[u]/f;o[u*i+a]=g}}this.needsUpdate=!0}};var Qx=`

	struct PhysicalCamera {

		float focusDistance;
		float anamorphicRatio;
		float bokehSize;
		int apertureBlades;
		float apertureRotation;

	};

`;var jx=`

	struct EquirectHdrInfo {

		sampler2D marginalWeights;
		sampler2D conditionalWeights;
		sampler2D map;

		float totalSum;

	};

`;var tv=`

	#define RECT_AREA_LIGHT_TYPE 0
	#define CIRC_AREA_LIGHT_TYPE 1
	#define SPOT_LIGHT_TYPE 2
	#define DIR_LIGHT_TYPE 3
	#define POINT_LIGHT_TYPE 4

	struct LightsInfo {

		sampler2D tex;
		uint count;

	};

	struct Light {

		vec3 position;
		int type;

		vec3 color;
		float intensity;

		vec3 u;
		vec3 v;
		float area;

		// spot light fields
		float radius;
		float near;
		float decay;
		float distance;
		float coneCos;
		float penumbraCos;
		int iesProfile;

	};

	Light readLightInfo( sampler2D tex, uint index ) {

		uint i = index * 6u;

		vec4 s0 = texelFetch1D( tex, i + 0u );
		vec4 s1 = texelFetch1D( tex, i + 1u );
		vec4 s2 = texelFetch1D( tex, i + 2u );
		vec4 s3 = texelFetch1D( tex, i + 3u );

		Light l;
		l.position = s0.rgb;
		l.type = int( round( s0.a ) );

		l.color = s1.rgb;
		l.intensity = s1.a;

		l.u = s2.rgb;
		l.v = s3.rgb;
		l.area = s3.a;

		if ( l.type == SPOT_LIGHT_TYPE || l.type == POINT_LIGHT_TYPE ) {

			vec4 s4 = texelFetch1D( tex, i + 4u );
			vec4 s5 = texelFetch1D( tex, i + 5u );
			l.radius = s4.r;
			l.decay = s4.g;
			l.distance = s4.b;
			l.coneCos = s4.a;

			l.penumbraCos = s5.r;
			l.iesProfile = int( round( s5.g ) );

		} else {

			l.radius = 0.0;
			l.decay = 0.0;
			l.distance = 0.0;

			l.coneCos = 0.0;
			l.penumbraCos = 0.0;
			l.iesProfile = - 1;

		}

		return l;

	}

`;var ev=`

	struct Material {

		vec3 color;
		int map;

		float metalness;
		int metalnessMap;

		float roughness;
		int roughnessMap;

		float ior;
		float transmission;
		int transmissionMap;

		float emissiveIntensity;
		vec3 emissive;
		int emissiveMap;

		int normalMap;
		vec2 normalScale;

		float clearcoat;
		int clearcoatMap;
		int clearcoatNormalMap;
		vec2 clearcoatNormalScale;
		float clearcoatRoughness;
		int clearcoatRoughnessMap;

		int iridescenceMap;
		int iridescenceThicknessMap;
		float iridescence;
		float iridescenceIor;
		float iridescenceThicknessMinimum;
		float iridescenceThicknessMaximum;

		vec3 specularColor;
		int specularColorMap;

		float specularIntensity;
		int specularIntensityMap;
		bool thinFilm;

		vec3 attenuationColor;
		float attenuationDistance;

		int alphaMap;

		bool castShadow;
		float opacity;
		float alphaTest;

		float side;
		bool matte;

		float sheen;
		vec3 sheenColor;
		int sheenColorMap;
		float sheenRoughness;
		int sheenRoughnessMap;

		bool vertexColors;
		bool flatShading;
		bool transparent;
		bool fogVolume;

		mat3 mapTransform;
		mat3 metalnessMapTransform;
		mat3 roughnessMapTransform;
		mat3 transmissionMapTransform;
		mat3 emissiveMapTransform;
		mat3 normalMapTransform;
		mat3 clearcoatMapTransform;
		mat3 clearcoatNormalMapTransform;
		mat3 clearcoatRoughnessMapTransform;
		mat3 sheenColorMapTransform;
		mat3 sheenRoughnessMapTransform;
		mat3 iridescenceMapTransform;
		mat3 iridescenceThicknessMapTransform;
		mat3 specularColorMapTransform;
		mat3 specularIntensityMapTransform;

	};

	mat3 readTextureTransform( sampler2D tex, uint index ) {

		mat3 textureTransform;

		vec4 row1 = texelFetch1D( tex, index );
		vec4 row2 = texelFetch1D( tex, index + 1u );

		textureTransform[0] = vec3(row1.r, row2.r, 0.0);
		textureTransform[1] = vec3(row1.g, row2.g, 0.0);
		textureTransform[2] = vec3(row1.b, row2.b, 1.0);

		return textureTransform;

	}

	Material readMaterialInfo( sampler2D tex, uint index ) {

		uint i = index * 45u;

		vec4 s0 = texelFetch1D( tex, i + 0u );
		vec4 s1 = texelFetch1D( tex, i + 1u );
		vec4 s2 = texelFetch1D( tex, i + 2u );
		vec4 s3 = texelFetch1D( tex, i + 3u );
		vec4 s4 = texelFetch1D( tex, i + 4u );
		vec4 s5 = texelFetch1D( tex, i + 5u );
		vec4 s6 = texelFetch1D( tex, i + 6u );
		vec4 s7 = texelFetch1D( tex, i + 7u );
		vec4 s8 = texelFetch1D( tex, i + 8u );
		vec4 s9 = texelFetch1D( tex, i + 9u );
		vec4 s10 = texelFetch1D( tex, i + 10u );
		vec4 s11 = texelFetch1D( tex, i + 11u );
		vec4 s12 = texelFetch1D( tex, i + 12u );
		vec4 s13 = texelFetch1D( tex, i + 13u );
		vec4 s14 = texelFetch1D( tex, i + 14u );

		Material m;
		m.color = s0.rgb;
		m.map = int( round( s0.a ) );

		m.metalness = s1.r;
		m.metalnessMap = int( round( s1.g ) );
		m.roughness = s1.b;
		m.roughnessMap = int( round( s1.a ) );

		m.ior = s2.r;
		m.transmission = s2.g;
		m.transmissionMap = int( round( s2.b ) );
		m.emissiveIntensity = s2.a;

		m.emissive = s3.rgb;
		m.emissiveMap = int( round( s3.a ) );

		m.normalMap = int( round( s4.r ) );
		m.normalScale = s4.gb;

		m.clearcoat = s4.a;
		m.clearcoatMap = int( round( s5.r ) );
		m.clearcoatRoughness = s5.g;
		m.clearcoatRoughnessMap = int( round( s5.b ) );
		m.clearcoatNormalMap = int( round( s5.a ) );
		m.clearcoatNormalScale = s6.rg;

		m.sheen = s6.a;
		m.sheenColor = s7.rgb;
		m.sheenColorMap = int( round( s7.a ) );
		m.sheenRoughness = s8.r;
		m.sheenRoughnessMap = int( round( s8.g ) );

		m.iridescenceMap = int( round( s8.b ) );
		m.iridescenceThicknessMap = int( round( s8.a ) );
		m.iridescence = s9.r;
		m.iridescenceIor = s9.g;
		m.iridescenceThicknessMinimum = s9.b;
		m.iridescenceThicknessMaximum = s9.a;

		m.specularColor = s10.rgb;
		m.specularColorMap = int( round( s10.a ) );

		m.specularIntensity = s11.r;
		m.specularIntensityMap = int( round( s11.g ) );
		m.thinFilm = bool( s11.b );

		m.attenuationColor = s12.rgb;
		m.attenuationDistance = s12.a;

		m.alphaMap = int( round( s13.r ) );

		m.opacity = s13.g;
		m.alphaTest = s13.b;
		m.side = s13.a;

		m.matte = bool( s14.r );
		m.castShadow = bool( s14.g );
		m.vertexColors = bool( int( s14.b ) & 1 );
		m.flatShading = bool( int( s14.b ) & 2 );
		m.fogVolume = bool( int( s14.b ) & 4 );
		m.transparent = bool( s14.a );

		uint firstTextureTransformIdx = i + 15u;

		// mat3( 1.0 ) is an identity matrix
		m.mapTransform = m.map == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx );
		m.metalnessMapTransform = m.metalnessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 2u );
		m.roughnessMapTransform = m.roughnessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 4u );
		m.transmissionMapTransform = m.transmissionMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 6u );
		m.emissiveMapTransform = m.emissiveMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 8u );
		m.normalMapTransform = m.normalMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 10u );
		m.clearcoatMapTransform = m.clearcoatMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 12u );
		m.clearcoatNormalMapTransform = m.clearcoatNormalMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 14u );
		m.clearcoatRoughnessMapTransform = m.clearcoatRoughnessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 16u );
		m.sheenColorMapTransform = m.sheenColorMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 18u );
		m.sheenRoughnessMapTransform = m.sheenRoughnessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 20u );
		m.iridescenceMapTransform = m.iridescenceMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 22u );
		m.iridescenceThicknessMapTransform = m.iridescenceThicknessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 24u );
		m.specularColorMapTransform = m.specularColorMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 26u );
		m.specularIntensityMapTransform = m.specularIntensityMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 28u );

		return m;

	}

`;var nv=`

	struct SurfaceRecord {

		// surface type
		bool volumeParticle;

		// geometry
		vec3 faceNormal;
		bool frontFace;
		vec3 normal;
		mat3 normalBasis;
		mat3 normalInvBasis;

		// cached properties
		float eta;
		float f0;

		// material
		float roughness;
		float filteredRoughness;
		float metalness;
		vec3 color;
		vec3 emission;

		// transmission
		float ior;
		float transmission;
		bool thinFilm;
		vec3 attenuationColor;
		float attenuationDistance;

		// clearcoat
		vec3 clearcoatNormal;
		mat3 clearcoatBasis;
		mat3 clearcoatInvBasis;
		float clearcoat;
		float clearcoatRoughness;
		float filteredClearcoatRoughness;

		// sheen
		float sheen;
		vec3 sheenColor;
		float sheenRoughness;

		// iridescence
		float iridescence;
		float iridescenceIor;
		float iridescenceThickness;

		// specular
		vec3 specularColor;
		float specularIntensity;
	};

	struct ScatterRecord {
		float specularPdf;
		float pdf;
		vec3 direction;
		vec3 color;
	};

`;var iv=`

	// samples the the given environment map in the given direction
	vec3 sampleEquirectColor( sampler2D envMap, vec3 direction ) {

		return texture2D( envMap, equirectDirectionToUv( direction ) ).rgb;

	}

	// gets the pdf of the given direction to sample
	float equirectDirectionPdf( vec3 direction ) {

		vec2 uv = equirectDirectionToUv( direction );
		float theta = uv.y * PI;
		float sinTheta = sin( theta );
		if ( sinTheta == 0.0 ) {

			return 0.0;

		}

		return 1.0 / ( 2.0 * PI * PI * sinTheta );

	}

	// samples the color given env map with CDF and returns the pdf of the direction
	float sampleEquirect( vec3 direction, inout vec3 color ) {

		float totalSum = envMapInfo.totalSum;
		if ( totalSum == 0.0 ) {

			color = vec3( 0.0 );
			return 1.0;

		}

		vec2 uv = equirectDirectionToUv( direction );
		color = texture2D( envMapInfo.map, uv ).rgb;

		float lum = luminance( color );
		ivec2 resolution = textureSize( envMapInfo.map, 0 );
		float pdf = lum / totalSum;

		return float( resolution.x * resolution.y ) * pdf * equirectDirectionPdf( direction );

	}

	// samples a direction of the envmap with color and retrieves pdf
	float sampleEquirectProbability( vec2 r, inout vec3 color, inout vec3 direction ) {

		// sample env map cdf
		float v = texture2D( envMapInfo.marginalWeights, vec2( r.x, 0.0 ) ).x;
		float u = texture2D( envMapInfo.conditionalWeights, vec2( r.y, v ) ).x;
		vec2 uv = vec2( u, v );

		vec3 derivedDirection = equirectUvToDirection( uv );
		direction = derivedDirection;
		color = texture2D( envMapInfo.map, uv ).rgb;

		float totalSum = envMapInfo.totalSum;
		float lum = luminance( color );
		ivec2 resolution = textureSize( envMapInfo.map, 0 );
		float pdf = lum / totalSum;

		return float( resolution.x * resolution.y ) * pdf * equirectDirectionPdf( direction );

	}
`;var rv=`

	float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {

		return smoothstep( coneCosine, penumbraCosine, angleCosine );

	}

	float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {

		// based upon Frostbite 3 Moving to Physically-based Rendering
		// page 32, equation 26: E[window1]
		// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), EPSILON );

		if ( cutoffDistance > 0.0 ) {

			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );

		}

		return distanceFalloff;

	}

	float getPhotometricAttenuation( sampler2DArray iesProfiles, int iesProfile, vec3 posToLight, vec3 lightDir, vec3 u, vec3 v ) {

		float cosTheta = dot( posToLight, lightDir );
		float angle = acos( cosTheta ) / PI;

		return texture2D( iesProfiles, vec3( angle, 0.0, iesProfile ) ).r;

	}

	struct LightRecord {

		float dist;
		vec3 direction;
		float pdf;
		vec3 emission;
		int type;

	};

	bool intersectLightAtIndex( sampler2D lights, vec3 rayOrigin, vec3 rayDirection, uint l, inout LightRecord lightRec ) {

		bool didHit = false;
		Light light = readLightInfo( lights, l );

		vec3 u = light.u;
		vec3 v = light.v;

		// check for backface
		vec3 normal = normalize( cross( u, v ) );
		if ( dot( normal, rayDirection ) > 0.0 ) {

			u *= 1.0 / dot( u, u );
			v *= 1.0 / dot( v, v );

			float dist;

			// MIS / light intersection is not supported for punctual lights.
			if(
				( light.type == RECT_AREA_LIGHT_TYPE && intersectsRectangle( light.position, normal, u, v, rayOrigin, rayDirection, dist ) ) ||
				( light.type == CIRC_AREA_LIGHT_TYPE && intersectsCircle( light.position, normal, u, v, rayOrigin, rayDirection, dist ) )
			) {

				float cosTheta = dot( rayDirection, normal );
				didHit = true;
				lightRec.dist = dist;
				lightRec.pdf = ( dist * dist ) / ( light.area * cosTheta );
				lightRec.emission = light.color * light.intensity;
				lightRec.direction = rayDirection;
				lightRec.type = light.type;

			}

		}

		return didHit;

	}

	LightRecord randomAreaLightSample( Light light, vec3 rayOrigin, vec2 ruv ) {

		vec3 randomPos;
		if( light.type == RECT_AREA_LIGHT_TYPE ) {

			// rectangular area light
			randomPos = light.position + light.u * ( ruv.x - 0.5 ) + light.v * ( ruv.y - 0.5 );

		} else if( light.type == CIRC_AREA_LIGHT_TYPE ) {

			// circular area light
			float r = 0.5 * sqrt( ruv.x );
			float theta = ruv.y * 2.0 * PI;
			float x = r * cos( theta );
			float y = r * sin( theta );

			randomPos = light.position + light.u * x + light.v * y;

		}

		vec3 toLight = randomPos - rayOrigin;
		float lightDistSq = dot( toLight, toLight );
		float dist = sqrt( lightDistSq );
		vec3 direction = toLight / dist;
		vec3 lightNormal = normalize( cross( light.u, light.v ) );

		LightRecord lightRec;
		lightRec.type = light.type;
		lightRec.emission = light.color * light.intensity;
		lightRec.dist = dist;
		lightRec.direction = direction;

		// TODO: the denominator is potentially zero
		lightRec.pdf = lightDistSq / ( light.area * dot( direction, lightNormal ) );

		return lightRec;

	}

	LightRecord randomSpotLightSample( Light light, sampler2DArray iesProfiles, vec3 rayOrigin, vec2 ruv ) {

		float radius = light.radius * sqrt( ruv.x );
		float theta = ruv.y * 2.0 * PI;
		float x = radius * cos( theta );
		float y = radius * sin( theta );

		vec3 u = light.u;
		vec3 v = light.v;
		vec3 normal = normalize( cross( u, v ) );

		float angle = acos( light.coneCos );
		float angleTan = tan( angle );
		float startDistance = light.radius / max( angleTan, EPSILON );

		vec3 randomPos = light.position - normal * startDistance + u * x + v * y;
		vec3 toLight = randomPos - rayOrigin;
		float lightDistSq = dot( toLight, toLight );
		float dist = sqrt( lightDistSq );

		vec3 direction = toLight / max( dist, EPSILON );
		float cosTheta = dot( direction, normal );

		float spotAttenuation = light.iesProfile != - 1 ?
			getPhotometricAttenuation( iesProfiles, light.iesProfile, direction, normal, u, v ) :
			getSpotAttenuation( light.coneCos, light.penumbraCos, cosTheta );

		float distanceAttenuation = getDistanceAttenuation( dist, light.distance, light.decay );
		LightRecord lightRec;
		lightRec.type = light.type;
		lightRec.dist = dist;
		lightRec.direction = direction;
		lightRec.emission = light.color * light.intensity * distanceAttenuation * spotAttenuation;
		lightRec.pdf = 1.0;

		return lightRec;

	}

	LightRecord randomLightSample( sampler2D lights, sampler2DArray iesProfiles, uint lightCount, vec3 rayOrigin, vec3 ruv ) {

		LightRecord result;

		// pick a random light
		uint l = uint( ruv.x * float( lightCount ) );
		Light light = readLightInfo( lights, l );

		if ( light.type == SPOT_LIGHT_TYPE ) {

			result = randomSpotLightSample( light, iesProfiles, rayOrigin, ruv.yz );

		} else if ( light.type == POINT_LIGHT_TYPE ) {

			vec3 lightRay = light.u - rayOrigin;
			float lightDist = length( lightRay );
			float cutoffDistance = light.distance;
			float distanceFalloff = 1.0 / max( pow( lightDist, light.decay ), 0.01 );
			if ( cutoffDistance > 0.0 ) {

				distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDist / cutoffDistance ) ) );

			}

			LightRecord rec;
			rec.direction = normalize( lightRay );
			rec.dist = length( lightRay );
			rec.pdf = 1.0;
			rec.emission = light.color * light.intensity * distanceFalloff;
			rec.type = light.type;
			result = rec;

		} else if ( light.type == DIR_LIGHT_TYPE ) {

			LightRecord rec;
			rec.dist = 1e10;
			rec.direction = light.u;
			rec.pdf = 1.0;
			rec.emission = light.color * light.intensity;
			rec.type = light.type;

			result = rec;

		} else {

			// sample the light
			result = randomAreaLightSample( light, rayOrigin, ruv.yz );

		}

		return result;

	}

`;var sv=`

	vec3 sampleHemisphere( vec3 n, vec2 uv ) {

		// https://www.rorydriscoll.com/2009/01/07/better-sampling/
		// https://graphics.pixar.com/library/OrthonormalB/paper.pdf
		float sign = n.z == 0.0 ? 1.0 : sign( n.z );
		float a = - 1.0 / ( sign + n.z );
		float b = n.x * n.y * a;
		vec3 b1 = vec3( 1.0 + sign * n.x * n.x * a, sign * b, - sign * n.x );
		vec3 b2 = vec3( b, sign + n.y * n.y * a, - n.y );

		float r = sqrt( uv.x );
		float theta = 2.0 * PI * uv.y;
		float x = r * cos( theta );
		float y = r * sin( theta );
		return x * b1 + y * b2 + sqrt( 1.0 - uv.x ) * n;

	}

	vec2 sampleTriangle( vec2 a, vec2 b, vec2 c, vec2 r ) {

		// get the edges of the triangle and the diagonal across the
		// center of the parallelogram
		vec2 e1 = a - b;
		vec2 e2 = c - b;
		vec2 diag = normalize( e1 + e2 );

		// pick the point in the parallelogram
		if ( r.x + r.y > 1.0 ) {

			r = vec2( 1.0 ) - r;

		}

		return e1 * r.x + e2 * r.y;

	}

	vec2 sampleCircle( vec2 uv ) {

		float angle = 2.0 * PI * uv.x;
		float radius = sqrt( uv.y );
		return vec2( cos( angle ), sin( angle ) ) * radius;

	}

	vec3 sampleSphere( vec2 uv ) {

		float u = ( uv.x - 0.5 ) * 2.0;
		float t = uv.y * PI * 2.0;
		float f = sqrt( 1.0 - u * u );

		return vec3( f * cos( t ), f * sin( t ), u );

	}

	vec2 sampleRegularPolygon( int sides, vec3 uvw ) {

		sides = max( sides, 3 );

		vec3 r = uvw;
		float anglePerSegment = 2.0 * PI / float( sides );
		float segment = floor( float( sides ) * r.x );

		float angle1 = anglePerSegment * segment;
		float angle2 = angle1 + anglePerSegment;
		vec2 a = vec2( sin( angle1 ), cos( angle1 ) );
		vec2 b = vec2( 0.0, 0.0 );
		vec2 c = vec2( sin( angle2 ), cos( angle2 ) );

		return sampleTriangle( a, b, c, r.yz );

	}

	// samples an aperture shape with the given number of sides. 0 means circle
	vec2 sampleAperture( int blades, vec3 uvw ) {

		return blades == 0 ?
			sampleCircle( uvw.xy ) :
			sampleRegularPolygon( blades, uvw );

	}


`;var ov=`

	bool totalInternalReflection( float cosTheta, float eta ) {

		float sinTheta = sqrt( 1.0 - cosTheta * cosTheta );
		return eta * sinTheta > 1.0;

	}

	// https://google.github.io/filament/Filament.md.html#materialsystem/diffusebrdf
	float schlickFresnel( float cosine, float f0 ) {

		return f0 + ( 1.0 - f0 ) * pow( 1.0 - cosine, 5.0 );

	}

	vec3 schlickFresnel( float cosine, vec3 f0 ) {

		return f0 + ( 1.0 - f0 ) * pow( 1.0 - cosine, 5.0 );

	}

	vec3 schlickFresnel( float cosine, vec3 f0, vec3 f90 ) {

		return f0 + ( f90 - f0 ) * pow( 1.0 - cosine, 5.0 );

	}

	float dielectricFresnel( float cosThetaI, float eta ) {

		// https://schuttejoe.github.io/post/disneybsdf/
		float ni = eta;
		float nt = 1.0;

		// Check for total internal reflection
		float sinThetaISq = 1.0f - cosThetaI * cosThetaI;
		float sinThetaTSq = eta * eta * sinThetaISq;
		if( sinThetaTSq >= 1.0 ) {

			return 1.0;

		}

		float sinThetaT = sqrt( sinThetaTSq );

		float cosThetaT = sqrt( max( 0.0, 1.0f - sinThetaT * sinThetaT ) );
		float rParallel = ( ( nt * cosThetaI ) - ( ni * cosThetaT ) ) / ( ( nt * cosThetaI ) + ( ni * cosThetaT ) );
		float rPerpendicular = ( ( ni * cosThetaI ) - ( nt * cosThetaT ) ) / ( ( ni * cosThetaI ) + ( nt * cosThetaT ) );
		return ( rParallel * rParallel + rPerpendicular * rPerpendicular ) / 2.0;

	}

	// https://raytracing.github.io/books/RayTracingInOneWeekend.html#dielectrics/schlickapproximation
	float iorRatioToF0( float eta ) {

		return pow( ( 1.0 - eta ) / ( 1.0 + eta ), 2.0 );

	}

	vec3 evaluateFresnel( float cosTheta, float eta, vec3 f0, vec3 f90 ) {

		if ( totalInternalReflection( cosTheta, eta ) ) {

			return f90;

		}

		return schlickFresnel( cosTheta, f0, f90 );

	}

	// TODO: disney fresnel was removed and replaced with this fresnel function to better align with
	// the glTF but is causing blown out pixels. Should be revisited
	// float evaluateFresnelWeight( float cosTheta, float eta, float f0 ) {

	// 	if ( totalInternalReflection( cosTheta, eta ) ) {

	// 		return 1.0;

	// 	}

	// 	return schlickFresnel( cosTheta, f0 );

	// }

	// https://schuttejoe.github.io/post/disneybsdf/
	float disneyFresnel( vec3 wo, vec3 wi, vec3 wh, float f0, float eta, float metalness ) {

		float dotHV = dot( wo, wh );
		if ( totalInternalReflection( dotHV, eta ) ) {

			return 1.0;

		}

		float dotHL = dot( wi, wh );
		float dielectricFresnel = dielectricFresnel( abs( dotHV ), eta );
		float metallicFresnel = schlickFresnel( dotHL, f0 );

		return mix( dielectricFresnel, metallicFresnel, metalness );

	}

`;var av=`

	// Fast arccos approximation used to remove banding artifacts caused by numerical errors in acos.
	// This is a cubic Lagrange interpolating polynomial for x = [-1, -1/2, 0, 1/2, 1].
	// For more information see: https://github.com/gkjohnson/three-gpu-pathtracer/pull/171#issuecomment-1152275248
	float acosApprox( float x ) {

		x = clamp( x, -1.0, 1.0 );
		return ( - 0.69813170079773212 * x * x - 0.87266462599716477 ) * x + 1.5707963267948966;

	}

	// An acos with input values bound to the range [-1, 1].
	float acosSafe( float x ) {

		return acos( clamp( x, -1.0, 1.0 ) );

	}

	float saturateCos( float val ) {

		return clamp( val, 0.001, 1.0 );

	}

	float square( float t ) {

		return t * t;

	}

	vec2 square( vec2 t ) {

		return t * t;

	}

	vec3 square( vec3 t ) {

		return t * t;

	}

	vec4 square( vec4 t ) {

		return t * t;

	}

	vec2 rotateVector( vec2 v, float t ) {

		float ac = cos( t );
		float as = sin( t );
		return vec2(
			v.x * ac - v.y * as,
			v.x * as + v.y * ac
		);

	}

	// forms a basis with the normal vector as Z
	mat3 getBasisFromNormal( vec3 normal ) {

		vec3 other;
		if ( abs( normal.x ) > 0.5 ) {

			other = vec3( 0.0, 1.0, 0.0 );

		} else {

			other = vec3( 1.0, 0.0, 0.0 );

		}

		vec3 ortho = normalize( cross( normal, other ) );
		vec3 ortho2 = normalize( cross( normal, ortho ) );
		return mat3( ortho2, ortho, normal );

	}

`;var cv=`

	// Finds the point where the ray intersects the plane defined by u and v and checks if this point
	// falls in the bounds of the rectangle on that same plane.
	// Plane intersection: https://lousodrome.net/blog/light/2020/07/03/intersection-of-a-ray-and-a-plane/
	bool intersectsRectangle( vec3 center, vec3 normal, vec3 u, vec3 v, vec3 rayOrigin, vec3 rayDirection, inout float dist ) {

		float t = dot( center - rayOrigin, normal ) / dot( rayDirection, normal );

		if ( t > EPSILON ) {

			vec3 p = rayOrigin + rayDirection * t;
			vec3 vi = p - center;

			// check if p falls inside the rectangle
			float a1 = dot( u, vi );
			if ( abs( a1 ) <= 0.5 ) {

				float a2 = dot( v, vi );
				if ( abs( a2 ) <= 0.5 ) {

					dist = t;
					return true;

				}

			}

		}

		return false;

	}

	// Finds the point where the ray intersects the plane defined by u and v and checks if this point
	// falls in the bounds of the circle on that same plane. See above URL for a description of the plane intersection algorithm.
	bool intersectsCircle( vec3 position, vec3 normal, vec3 u, vec3 v, vec3 rayOrigin, vec3 rayDirection, inout float dist ) {

		float t = dot( position - rayOrigin, normal ) / dot( rayDirection, normal );

		if ( t > EPSILON ) {

			vec3 hit = rayOrigin + rayDirection * t;
			vec3 vi = hit - position;

			float a1 = dot( u, vi );
			float a2 = dot( v, vi );

			if( length( vec2( a1, a2 ) ) <= 0.5 ) {

				dist = t;
				return true;

			}

		}

		return false;

	}

`;var lv=`

	// add texel fetch functions for texture arrays
	vec4 texelFetch1D( sampler2DArray tex, int layer, uint index ) {

		uint width = uint( textureSize( tex, 0 ).x );
		uvec2 uv;
		uv.x = index % width;
		uv.y = index / width;

		return texelFetch( tex, ivec3( uv, layer ), 0 );

	}

	vec4 textureSampleBarycoord( sampler2DArray tex, int layer, vec3 barycoord, uvec3 faceIndices ) {

		return
			barycoord.x * texelFetch1D( tex, layer, faceIndices.x ) +
			barycoord.y * texelFetch1D( tex, layer, faceIndices.y ) +
			barycoord.z * texelFetch1D( tex, layer, faceIndices.z );

	}

`;var Zs=`

	// TODO: possibly this should be renamed something related to material or path tracing logic

	#ifndef RAY_OFFSET
	#define RAY_OFFSET 1e-4
	#endif

	// adjust the hit point by the surface normal by a factor of some offset and the
	// maximum component-wise value of the current point to accommodate floating point
	// error as values increase.
	vec3 stepRayOrigin( vec3 rayOrigin, vec3 rayDirection, vec3 offset, float dist ) {

		vec3 point = rayOrigin + rayDirection * dist;
		vec3 absPoint = abs( point );
		float maxPoint = max( absPoint.x, max( absPoint.y, absPoint.z ) );
		return point + offset * ( maxPoint + 1.0 ) * RAY_OFFSET;

	}

	// https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md#attenuation
	vec3 transmissionAttenuation( float dist, vec3 attColor, float attDist ) {

		vec3 ot = - log( attColor ) / attDist;
		return exp( - ot * dist );

	}

	vec3 getHalfVector( vec3 wi, vec3 wo, float eta ) {

		// get the half vector - assuming if the light incident vector is on the other side
		// of the that it's transmissive.
		vec3 h;
		if ( wi.z > 0.0 ) {

			h = normalize( wi + wo );

		} else {

			// Scale by the ior ratio to retrieve the appropriate half vector
			// From Section 2.2 on computing the transmission half vector:
			// https://blog.selfshadow.com/publications/s2015-shading-course/burley/s2015_pbs_disney_bsdf_notes.pdf
			h = normalize( wi + wo * eta );

		}

		h *= sign( h.z );
		return h;

	}

	vec3 getHalfVector( vec3 a, vec3 b ) {

		return normalize( a + b );

	}

	// The discrepancy between interpolated surface normal and geometry normal can cause issues when a ray
	// is cast that is on the top side of the geometry normal plane but below the surface normal plane. If
	// we find a ray like that we ignore it to avoid artifacts.
	// This function returns if the direction is on the same side of both planes.
	bool isDirectionValid( vec3 direction, vec3 surfaceNormal, vec3 geometryNormal ) {

		bool aboveSurfaceNormal = dot( direction, surfaceNormal ) > 0.0;
		bool aboveGeometryNormal = dot( direction, geometryNormal ) > 0.0;
		return aboveSurfaceNormal == aboveGeometryNormal;

	}

	// ray sampling x and z are swapped to align with expected background view
	vec2 equirectDirectionToUv( vec3 direction ) {

		// from Spherical.setFromCartesianCoords
		vec2 uv = vec2( atan( direction.z, direction.x ), acos( direction.y ) );
		uv /= vec2( 2.0 * PI, PI );

		// apply adjustments to get values in range [0, 1] and y right side up
		uv.x += 0.5;
		uv.y = 1.0 - uv.y;
		return uv;

	}

	vec3 equirectUvToDirection( vec2 uv ) {

		// undo above adjustments
		uv.x -= 0.5;
		uv.y = 1.0 - uv.y;

		// from Vector3.setFromSphericalCoords
		float theta = uv.x * 2.0 * PI;
		float phi = uv.y * PI;

		float sinPhi = sin( phi );

		return vec3( sinPhi * cos( theta ), cos( phi ), sinPhi * sin( theta ) );

	}

	// power heuristic for multiple importance sampling
	float misHeuristic( float a, float b ) {

		float aa = a * a;
		float bb = b * b;
		return aa / ( aa + bb );

	}

	// tentFilter from Peter Shirley's 'Realistic Ray Tracing (2nd Edition)' book, pg. 60
	// erichlof/THREE.js-PathTracing-Renderer/
	float tentFilter( float x ) {

		return x < 0.5 ? sqrt( 2.0 * x ) - 1.0 : 1.0 - sqrt( 2.0 - ( 2.0 * x ) );

	}
`;var Dp=`

	// https://www.shadertoy.com/view/wltcRS
	uvec4 WHITE_NOISE_SEED;

	void rng_initialize( vec2 p, int frame ) {

		// white noise seed
		WHITE_NOISE_SEED = uvec4( p, uint( frame ), uint( p.x ) + uint( p.y ) );

	}

	// https://www.pcg-random.org/
	void pcg4d( inout uvec4 v ) {

		v = v * 1664525u + 1013904223u;
		v.x += v.y * v.w;
		v.y += v.z * v.x;
		v.z += v.x * v.y;
		v.w += v.y * v.z;
		v = v ^ ( v >> 16u );
		v.x += v.y*v.w;
		v.y += v.z*v.x;
		v.z += v.x*v.y;
		v.w += v.y*v.z;

	}

	// returns [ 0, 1 ]
	float pcgRand() {

		pcg4d( WHITE_NOISE_SEED );
		return float( WHITE_NOISE_SEED.x ) / float( 0xffffffffu );

	}

	vec2 pcgRand2() {

		pcg4d( WHITE_NOISE_SEED );
		return vec2( WHITE_NOISE_SEED.xy ) / float(0xffffffffu);

	}

	vec3 pcgRand3() {

		pcg4d( WHITE_NOISE_SEED );
		return vec3( WHITE_NOISE_SEED.xyz ) / float( 0xffffffffu );

	}

	vec4 pcgRand4() {

		pcg4d( WHITE_NOISE_SEED );
		return vec4( WHITE_NOISE_SEED ) / float( 0xffffffffu );

	}
`;var uv=`

	uniform sampler2D stratifiedTexture;
	uniform sampler2D stratifiedOffsetTexture;

	uint sobolPixelIndex = 0u;
	uint sobolPathIndex = 0u;
	uint sobolBounceIndex = 0u;
	vec4 pixelSeed = vec4( 0 );

	vec4 rand4( int v ) {

		ivec2 uv = ivec2( v, sobolBounceIndex );
		vec4 stratifiedSample = texelFetch( stratifiedTexture, uv, 0 );
		return fract( stratifiedSample + pixelSeed.r ); // blue noise + stratified samples

	}

	vec3 rand3( int v ) {

		return rand4( v ).xyz;

	}

	vec2 rand2( int v ) {

		return rand4( v ).xy;

	}

	float rand( int v ) {

		return rand4( v ).x;

	}

	void rng_initialize( vec2 screenCoord, int frame ) {

		// tile the small noise texture across the entire screen
		ivec2 noiseSize = ivec2( textureSize( stratifiedOffsetTexture, 0 ) );
		ivec2 pixel = ivec2( screenCoord.xy ) % noiseSize;
		vec2 pixelWidth = 1.0 / vec2( noiseSize );
		vec2 uv = vec2( pixel ) * pixelWidth + pixelWidth * 0.5;

		// note that using "texelFetch" here seems to break Android for some reason
		pixelSeed = texture( stratifiedOffsetTexture, uv );

	}

`;var hv=`

	// diffuse
	float diffuseEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		// https://schuttejoe.github.io/post/disneybsdf/
		float fl = schlickFresnel( wi.z, 0.0 );
		float fv = schlickFresnel( wo.z, 0.0 );

		float metalFactor = ( 1.0 - surf.metalness );
		float transFactor = ( 1.0 - surf.transmission );
		float rr = 0.5 + 2.0 * surf.roughness * fl * fl;
		float retro = rr * ( fl + fv + fl * fv * ( rr - 1.0f ) );
		float lambert = ( 1.0f - 0.5f * fl ) * ( 1.0f - 0.5f * fv );

		// TODO: subsurface approx?

		// float F = evaluateFresnelWeight( dot( wo, wh ), surf.eta, surf.f0 );
		float F = disneyFresnel( wo, wi, wh, surf.f0, surf.eta, surf.metalness );
		color = ( 1.0 - F ) * transFactor * metalFactor * wi.z * surf.color * ( retro + lambert ) / PI;

		return wi.z / PI;

	}

	vec3 diffuseDirection( vec3 wo, SurfaceRecord surf ) {

		vec3 lightDirection = sampleSphere( rand2( 11 ) );
		lightDirection.z += 1.0;
		lightDirection = normalize( lightDirection );

		return lightDirection;

	}

	// specular
	float specularEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		// if roughness is set to 0 then D === NaN which results in black pixels
		float metalness = surf.metalness;
		float roughness = surf.filteredRoughness;

		float eta = surf.eta;
		float f0 = surf.f0;

		vec3 f0Color = mix( f0 * surf.specularColor * surf.specularIntensity, surf.color, surf.metalness );
		vec3 f90Color = vec3( mix( surf.specularIntensity, 1.0, surf.metalness ) );
		vec3 F = evaluateFresnel( dot( wo, wh ), eta, f0Color, f90Color );

		vec3 iridescenceF = evalIridescence( 1.0, surf.iridescenceIor, dot( wi, wh ), surf.iridescenceThickness, f0Color );
		F = mix( F, iridescenceF,  surf.iridescence );

		// PDF
		// See 14.1.1 Microfacet BxDFs in https://www.pbr-book.org/
		float incidentTheta = acos( wo.z );
		float G = ggxShadowMaskG2( wi, wo, roughness );
		float D = ggxDistribution( wh, roughness );
		float G1 = ggxShadowMaskG1( incidentTheta, roughness );
		float ggxPdf = D * G1 * max( 0.0, abs( dot( wo, wh ) ) ) / abs ( wo.z );

		color = wi.z * F * G * D / ( 4.0 * abs( wi.z * wo.z ) );
		return ggxPdf / ( 4.0 * dot( wo, wh ) );

	}

	vec3 specularDirection( vec3 wo, SurfaceRecord surf ) {

		// sample ggx vndf distribution which gives a new normal
		float roughness = surf.filteredRoughness;
		vec3 halfVector = ggxDirection(
			wo,
			vec2( roughness ),
			rand2( 12 )
		);

		// apply to new ray by reflecting off the new normal
		return - reflect( wo, halfVector );

	}


	// transmission
	/*
	float transmissionEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		// See section 4.2 in https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.pdf

		float filteredRoughness = surf.filteredRoughness;
		float eta = surf.eta;
		bool frontFace = surf.frontFace;
		bool thinFilm = surf.thinFilm;

		color = surf.transmission * surf.color;

		float denom = pow( eta * dot( wi, wh ) + dot( wo, wh ), 2.0 );
		return ggxPDF( wo, wh, filteredRoughness ) / denom;

	}

	vec3 transmissionDirection( vec3 wo, SurfaceRecord surf ) {

		float filteredRoughness = surf.filteredRoughness;
		float eta = surf.eta;
		bool frontFace = surf.frontFace;

		// sample ggx vndf distribution which gives a new normal
		vec3 halfVector = ggxDirection(
			wo,
			vec2( filteredRoughness ),
			rand2( 13 )
		);

		vec3 lightDirection = refract( normalize( - wo ), halfVector, eta );
		if ( surf.thinFilm ) {

			lightDirection = - refract( normalize( - lightDirection ), - vec3( 0.0, 0.0, 1.0 ), 1.0 / eta );

		}

		return normalize( lightDirection );

	}
	*/

	// TODO: This is just using a basic cosine-weighted specular distribution with an
	// incorrect PDF value at the moment. Update it to correctly use a GGX distribution
	float transmissionEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		color = surf.transmission * surf.color;

		// PDF
		// float F = evaluateFresnelWeight( dot( wo, wh ), surf.eta, surf.f0 );
		// float F = disneyFresnel( wo, wi, wh, surf.f0, surf.eta, surf.metalness );
		// if ( F >= 1.0 ) {

		// 	return 0.0;

		// }

		// return 1.0 / ( 1.0 - F );

		// reverted to previous to transmission. The above was causing black pixels
		float eta = surf.eta;
		float f0 = surf.f0;
		float cosTheta = min( wo.z, 1.0 );
		float sinTheta = sqrt( 1.0 - cosTheta * cosTheta );
		float reflectance = schlickFresnel( cosTheta, f0 );
		bool cannotRefract = eta * sinTheta > 1.0;
		if ( cannotRefract ) {

			return 0.0;

		}

		return 1.0 / ( 1.0 - reflectance );

	}

	vec3 transmissionDirection( vec3 wo, SurfaceRecord surf ) {

		float roughness = surf.filteredRoughness;
		float eta = surf.eta;
		vec3 halfVector = normalize( vec3( 0.0, 0.0, 1.0 ) + sampleSphere( rand2( 13 ) ) * roughness );
		vec3 lightDirection = refract( normalize( - wo ), halfVector, eta );

		if ( surf.thinFilm ) {

			lightDirection = - refract( normalize( - lightDirection ), - vec3( 0.0, 0.0, 1.0 ), 1.0 / eta );

		}
		return normalize( lightDirection );

	}

	// clearcoat
	float clearcoatEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		float ior = 1.5;
		float f0 = iorRatioToF0( ior );
		bool frontFace = surf.frontFace;
		float roughness = surf.filteredClearcoatRoughness;

		float eta = frontFace ? 1.0 / ior : ior;
		float G = ggxShadowMaskG2( wi, wo, roughness );
		float D = ggxDistribution( wh, roughness );
		float F = schlickFresnel( dot( wi, wh ), f0 );

		float fClearcoat = F * D * G / ( 4.0 * abs( wi.z * wo.z ) );
		color = color * ( 1.0 - surf.clearcoat * F ) + fClearcoat * surf.clearcoat * wi.z;

		// PDF
		// See equation (27) in http://jcgt.org/published/0003/02/03/
		return ggxPDF( wo, wh, roughness ) / ( 4.0 * dot( wi, wh ) );

	}

	vec3 clearcoatDirection( vec3 wo, SurfaceRecord surf ) {

		// sample ggx vndf distribution which gives a new normal
		float roughness = surf.filteredClearcoatRoughness;
		vec3 halfVector = ggxDirection(
			wo,
			vec2( roughness ),
			rand2( 14 )
		);

		// apply to new ray by reflecting off the new normal
		return - reflect( wo, halfVector );

	}

	// sheen
	vec3 sheenColor( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf ) {

		float cosThetaO = saturateCos( wo.z );
		float cosThetaI = saturateCos( wi.z );
		float cosThetaH = wh.z;

		float D = velvetD( cosThetaH, surf.sheenRoughness );
		float G = velvetG( cosThetaO, cosThetaI, surf.sheenRoughness );

		// See equation (1) in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
		vec3 color = surf.sheenColor;
		color *= D * G / ( 4.0 * abs( cosThetaO * cosThetaI ) );
		color *= wi.z;

		return color;

	}

	// bsdf
	void getLobeWeights(
		vec3 wo, vec3 wi, vec3 wh, vec3 clearcoatWo, SurfaceRecord surf,
		inout float diffuseWeight, inout float specularWeight, inout float transmissionWeight, inout float clearcoatWeight
	) {

		float metalness = surf.metalness;
		float transmission = surf.transmission;
		// float fEstimate = evaluateFresnelWeight( dot( wo, wh ), surf.eta, surf.f0 );
		float fEstimate = disneyFresnel( wo, wi, wh, surf.f0, surf.eta, surf.metalness );

		float transSpecularProb = mix( max( 0.25, fEstimate ), 1.0, metalness );
		float diffSpecularProb = 0.5 + 0.5 * metalness;

		diffuseWeight = ( 1.0 - transmission ) * ( 1.0 - diffSpecularProb );
		specularWeight = transmission * transSpecularProb + ( 1.0 - transmission ) * diffSpecularProb;
		transmissionWeight = transmission * ( 1.0 - transSpecularProb );
		clearcoatWeight = surf.clearcoat * schlickFresnel( clearcoatWo.z, 0.04 );

		float totalWeight = diffuseWeight + specularWeight + transmissionWeight + clearcoatWeight;
		diffuseWeight /= totalWeight;
		specularWeight /= totalWeight;
		transmissionWeight /= totalWeight;
		clearcoatWeight /= totalWeight;
	}

	float bsdfEval(
		vec3 wo, vec3 clearcoatWo, vec3 wi, vec3 clearcoatWi, SurfaceRecord surf,
		float diffuseWeight, float specularWeight, float transmissionWeight, float clearcoatWeight, inout float specularPdf, inout vec3 color
	) {

		float metalness = surf.metalness;
		float transmission = surf.transmission;

		float spdf = 0.0;
		float dpdf = 0.0;
		float tpdf = 0.0;
		float cpdf = 0.0;
		color = vec3( 0.0 );

		vec3 halfVector = getHalfVector( wi, wo, surf.eta );

		// diffuse
		if ( diffuseWeight > 0.0 && wi.z > 0.0 ) {

			dpdf = diffuseEval( wo, wi, halfVector, surf, color );
			color *= 1.0 - surf.transmission;

		}

		// ggx specular
		if ( specularWeight > 0.0 && wi.z > 0.0 ) {

			vec3 outColor;
			spdf = specularEval( wo, wi, getHalfVector( wi, wo ), surf, outColor );
			color += outColor;

		}

		// transmission
		if ( transmissionWeight > 0.0 && wi.z < 0.0 ) {

			tpdf = transmissionEval( wo, wi, halfVector, surf, color );

		}

		// sheen
		color *= mix( 1.0, sheenAlbedoScaling( wo, wi, surf ), surf.sheen );
		color += sheenColor( wo, wi, halfVector, surf ) * surf.sheen;

		// clearcoat
		if ( clearcoatWi.z >= 0.0 && clearcoatWeight > 0.0 ) {

			vec3 clearcoatHalfVector = getHalfVector( clearcoatWo, clearcoatWi );
			cpdf = clearcoatEval( clearcoatWo, clearcoatWi, clearcoatHalfVector, surf, color );

		}

		float pdf =
			dpdf * diffuseWeight
			+ spdf * specularWeight
			+ tpdf * transmissionWeight
			+ cpdf * clearcoatWeight;

		// retrieve specular rays for the shadows flag
		specularPdf = spdf * specularWeight + cpdf * clearcoatWeight;

		return pdf;

	}

	float bsdfResult( vec3 worldWo, vec3 worldWi, SurfaceRecord surf, inout vec3 color ) {

		if ( surf.volumeParticle ) {

			color = surf.color / ( 4.0 * PI );
			return 1.0 / ( 4.0 * PI );

		}

		vec3 wo = normalize( surf.normalInvBasis * worldWo );
		vec3 wi = normalize( surf.normalInvBasis * worldWi );

		vec3 clearcoatWo = normalize( surf.clearcoatInvBasis * worldWo );
		vec3 clearcoatWi = normalize( surf.clearcoatInvBasis * worldWi );

		vec3 wh = getHalfVector( wo, wi, surf.eta );
		float diffuseWeight;
		float specularWeight;
		float transmissionWeight;
		float clearcoatWeight;
		getLobeWeights( wo, wi, wh, clearcoatWo, surf, diffuseWeight, specularWeight, transmissionWeight, clearcoatWeight );

		float specularPdf;
		return bsdfEval( wo, clearcoatWo, wi, clearcoatWi, surf, diffuseWeight, specularWeight, transmissionWeight, clearcoatWeight, specularPdf, color );

	}

	ScatterRecord bsdfSample( vec3 worldWo, SurfaceRecord surf ) {

		if ( surf.volumeParticle ) {

			ScatterRecord sampleRec;
			sampleRec.specularPdf = 0.0;
			sampleRec.pdf = 1.0 / ( 4.0 * PI );
			sampleRec.direction = sampleSphere( rand2( 16 ) );
			sampleRec.color = surf.color / ( 4.0 * PI );
			return sampleRec;

		}

		vec3 wo = normalize( surf.normalInvBasis * worldWo );
		vec3 clearcoatWo = normalize( surf.clearcoatInvBasis * worldWo );
		mat3 normalBasis = surf.normalBasis;
		mat3 invBasis = surf.normalInvBasis;
		mat3 clearcoatNormalBasis = surf.clearcoatBasis;
		mat3 clearcoatInvBasis = surf.clearcoatInvBasis;

		float diffuseWeight;
		float specularWeight;
		float transmissionWeight;
		float clearcoatWeight;
		// using normal and basically-reflected ray since we don't have proper half vector here
		getLobeWeights( wo, wo, vec3( 0, 0, 1 ), clearcoatWo, surf, diffuseWeight, specularWeight, transmissionWeight, clearcoatWeight );

		float pdf[4];
		pdf[0] = diffuseWeight;
		pdf[1] = specularWeight;
		pdf[2] = transmissionWeight;
		pdf[3] = clearcoatWeight;

		float cdf[4];
		cdf[0] = pdf[0];
		cdf[1] = pdf[1] + cdf[0];
		cdf[2] = pdf[2] + cdf[1];
		cdf[3] = pdf[3] + cdf[2];

		if( cdf[3] != 0.0 ) {

			float invMaxCdf = 1.0 / cdf[3];
			cdf[0] *= invMaxCdf;
			cdf[1] *= invMaxCdf;
			cdf[2] *= invMaxCdf;
			cdf[3] *= invMaxCdf;

		} else {

			cdf[0] = 1.0;
			cdf[1] = 0.0;
			cdf[2] = 0.0;
			cdf[3] = 0.0;

		}

		vec3 wi;
		vec3 clearcoatWi;

		float r = rand( 15 );
		if ( r <= cdf[0] ) { // diffuse

			wi = diffuseDirection( wo, surf );
			clearcoatWi = normalize( clearcoatInvBasis * normalize( normalBasis * wi ) );

		} else if ( r <= cdf[1] ) { // specular

			wi = specularDirection( wo, surf );
			clearcoatWi = normalize( clearcoatInvBasis * normalize( normalBasis * wi ) );

		} else if ( r <= cdf[2] ) { // transmission / refraction

			wi = transmissionDirection( wo, surf );
			clearcoatWi = normalize( clearcoatInvBasis * normalize( normalBasis * wi ) );

		} else if ( r <= cdf[3] ) { // clearcoat

			clearcoatWi = clearcoatDirection( clearcoatWo, surf );
			wi = normalize( invBasis * normalize( clearcoatNormalBasis * clearcoatWi ) );

		}

		ScatterRecord result;
		result.pdf = bsdfEval( wo, clearcoatWo, wi, clearcoatWi, surf, diffuseWeight, specularWeight, transmissionWeight, clearcoatWeight, result.specularPdf, result.color );
		result.direction = normalize( surf.normalBasis * wi );

		return result;

	}

`;var fv=`

	// returns the hit distance given the material density
	float intersectFogVolume( Material material, float u ) {

		// https://raytracing.github.io/books/RayTracingTheNextWeek.html#volumes/constantdensitymediums
		return material.opacity == 0.0 ? INFINITY : ( - 1.0 / material.opacity ) * log( u );

	}

	ScatterRecord sampleFogVolume( SurfaceRecord surf, vec2 uv ) {

		ScatterRecord sampleRec;
		sampleRec.specularPdf = 0.0;
		sampleRec.pdf = 1.0 / ( 2.0 * PI );
		sampleRec.direction = sampleSphere( uv );
		sampleRec.color = surf.color;
		return sampleRec;

	}

`;var dv=`

	// The GGX functions provide sampling and distribution information for normals as output so
	// in order to get probability of scatter direction the half vector must be computed and provided.
	// [0] https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.pdf
	// [1] https://hal.archives-ouvertes.fr/hal-01509746/document
	// [2] http://jcgt.org/published/0007/04/01/
	// [4] http://jcgt.org/published/0003/02/03/

	// trowbridge-reitz === GGX === GTR

	vec3 ggxDirection( vec3 incidentDir, vec2 roughness, vec2 uv ) {

		// TODO: try GGXVNDF implementation from reference [2], here. Needs to update ggxDistribution
		// function below, as well

		// Implementation from reference [1]
		// stretch view
		vec3 V = normalize( vec3( roughness * incidentDir.xy, incidentDir.z ) );

		// orthonormal basis
		vec3 T1 = ( V.z < 0.9999 ) ? normalize( cross( V, vec3( 0.0, 0.0, 1.0 ) ) ) : vec3( 1.0, 0.0, 0.0 );
		vec3 T2 = cross( T1, V );

		// sample point with polar coordinates (r, phi)
		float a = 1.0 / ( 1.0 + V.z );
		float r = sqrt( uv.x );
		float phi = ( uv.y < a ) ? uv.y / a * PI : PI + ( uv.y - a ) / ( 1.0 - a ) * PI;
		float P1 = r * cos( phi );
		float P2 = r * sin( phi ) * ( ( uv.y < a ) ? 1.0 : V.z );

		// compute normal
		vec3 N = P1 * T1 + P2 * T2 + V * sqrt( max( 0.0, 1.0 - P1 * P1 - P2 * P2 ) );

		// unstretch
		N = normalize( vec3( roughness * N.xy, max( 0.0, N.z ) ) );

		return N;

	}

	// Below are PDF and related functions for use in a Monte Carlo path tracer
	// as specified in Appendix B of the following paper
	// See equation (34) from reference [0]
	float ggxLamda( float theta, float roughness ) {

		float tanTheta = tan( theta );
		float tanTheta2 = tanTheta * tanTheta;
		float alpha2 = roughness * roughness;

		float numerator = - 1.0 + sqrt( 1.0 + alpha2 * tanTheta2 );
		return numerator / 2.0;

	}

	// See equation (34) from reference [0]
	float ggxShadowMaskG1( float theta, float roughness ) {

		return 1.0 / ( 1.0 + ggxLamda( theta, roughness ) );

	}

	// See equation (125) from reference [4]
	float ggxShadowMaskG2( vec3 wi, vec3 wo, float roughness ) {

		float incidentTheta = acos( wi.z );
		float scatterTheta = acos( wo.z );
		return 1.0 / ( 1.0 + ggxLamda( incidentTheta, roughness ) + ggxLamda( scatterTheta, roughness ) );

	}

	// See equation (33) from reference [0]
	float ggxDistribution( vec3 halfVector, float roughness ) {

		float a2 = roughness * roughness;
		a2 = max( EPSILON, a2 );
		float cosTheta = halfVector.z;
		float cosTheta4 = pow( cosTheta, 4.0 );

		if ( cosTheta == 0.0 ) return 0.0;

		float theta = acosSafe( halfVector.z );
		float tanTheta = tan( theta );
		float tanTheta2 = pow( tanTheta, 2.0 );

		float denom = PI * cosTheta4 * pow( a2 + tanTheta2, 2.0 );
		return ( a2 / denom );

	}

	// See equation (3) from reference [2]
	float ggxPDF( vec3 wi, vec3 halfVector, float roughness ) {

		float incidentTheta = acos( wi.z );
		float D = ggxDistribution( halfVector, roughness );
		float G1 = ggxShadowMaskG1( incidentTheta, roughness );

		return D * G1 * max( 0.0, dot( wi, halfVector ) ) / wi.z;

	}

`;var pv=`

	// XYZ to sRGB color space
	const mat3 XYZ_TO_REC709 = mat3(
		3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);

	vec3 fresnel0ToIor( vec3 fresnel0 ) {

		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );

	}

	// Conversion FO/IOR
	vec3 iorToFresnel0( vec3 transmittedIor, float incidentIor ) {

		return square( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );

	}

	// ior is a value between 1.0 and 3.0. 1.0 is air interface
	float iorToFresnel0( float transmittedIor, float incidentIor ) {

		return square( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ) );

	}

	// Fresnel equations for dielectric/dielectric interfaces. See https://belcour.github.io/blog/research/2017/05/01/brdf-thin-film.html
	vec3 evalSensitivity( float OPD, vec3 shift ) {

		float phase = 2.0 * PI * OPD * 1.0e-9;

		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );

		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - square( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * square( phase ) );
		xyz /= 1.0685e-7;

		vec3 srgb = XYZ_TO_REC709 * xyz;
		return srgb;

	}

	// See Section 4. Analytic Spectral Integration, A Practical Extension to Microfacet Theory for the Modeling of Varying Iridescence, https://hal.archives-ouvertes.fr/hal-01518344/document
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {

		vec3 I;

		// Force iridescenceIor -> outsideIOR when thinFilmThickness -> 0.0
		float iridescenceIor = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );

		// Evaluate the cosTheta on the base layer (Snell law)
		float sinTheta2Sq = square( outsideIOR / iridescenceIor ) * ( 1.0 - square( cosTheta1 ) );

		// Handle TIR:
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {

			return vec3( 1.0 );

		}

		float cosTheta2 = sqrt( cosTheta2Sq );

		// First interface
		float R0 = iorToFresnel0( iridescenceIor, outsideIOR );
		float R12 = schlickFresnel( cosTheta1, R0 );
		float R21 = R12;
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIor < outsideIOR ) {

			phi12 = PI;

		}

		float phi21 = PI - phi12;

		// Second interface
		vec3 baseIOR = fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) ); // guard against 1.0
		vec3 R1 = iorToFresnel0( baseIOR, iridescenceIor );
		vec3 R23 = schlickFresnel( cosTheta2, R1 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[0] < iridescenceIor ) {

			phi23[ 0 ] = PI;

		}

		if ( baseIOR[1] < iridescenceIor ) {

			phi23[ 1 ] = PI;

		}

		if ( baseIOR[2] < iridescenceIor ) {

			phi23[ 2 ] = PI;

		}

		// Phase shift
		float OPD = 2.0 * iridescenceIor * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;

		// Compound terms
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = square( T121 ) * R23 / ( vec3( 1.0 ) - R123 );

		// Reflectance term for m = 0 (DC term amplitude)
		vec3 C0 = R12 + Rs;
		I = C0;

		// Reflectance term for m > 0 (pairs of diracs)
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {

			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;

		}

		// Since out of gamut colors might be produced, negative color values are clamped to 0.
		return max( I, vec3( 0.0 ) );

	}

`;var mv=`

	// See equation (2) in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
	float velvetD( float cosThetaH, float roughness ) {

		float alpha = max( roughness, 0.07 );
		alpha = alpha * alpha;

		float invAlpha = 1.0 / alpha;

		float sqrCosThetaH = cosThetaH * cosThetaH;
		float sinThetaH = max( 1.0 - sqrCosThetaH, 0.001 );

		return ( 2.0 + invAlpha ) * pow( sinThetaH, 0.5 * invAlpha ) / ( 2.0 * PI );

	}

	float velvetParamsInterpolate( int i, float oneMinusAlphaSquared ) {

		const float p0[5] = float[5]( 25.3245, 3.32435, 0.16801, -1.27393, -4.85967 );
		const float p1[5] = float[5]( 21.5473, 3.82987, 0.19823, -1.97760, -4.32054 );

		return mix( p1[i], p0[i], oneMinusAlphaSquared );

	}

	float velvetL( float x, float alpha ) {

		float oneMinusAlpha = 1.0 - alpha;
		float oneMinusAlphaSquared = oneMinusAlpha * oneMinusAlpha;

		float a = velvetParamsInterpolate( 0, oneMinusAlphaSquared );
		float b = velvetParamsInterpolate( 1, oneMinusAlphaSquared );
		float c = velvetParamsInterpolate( 2, oneMinusAlphaSquared );
		float d = velvetParamsInterpolate( 3, oneMinusAlphaSquared );
		float e = velvetParamsInterpolate( 4, oneMinusAlphaSquared );

		return a / ( 1.0 + b * pow( abs( x ), c ) ) + d * x + e;

	}

	// See equation (3) in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
	float velvetLambda( float cosTheta, float alpha ) {

		return abs( cosTheta ) < 0.5 ? exp( velvetL( cosTheta, alpha ) ) : exp( 2.0 * velvetL( 0.5, alpha ) - velvetL( 1.0 - cosTheta, alpha ) );

	}

	// See Section 3, Shadowing Term, in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
	float velvetG( float cosThetaO, float cosThetaI, float roughness ) {

		float alpha = max( roughness, 0.07 );
		alpha = alpha * alpha;

		return 1.0 / ( 1.0 + velvetLambda( cosThetaO, alpha ) + velvetLambda( cosThetaI, alpha ) );

	}

	float directionalAlbedoSheen( float cosTheta, float alpha ) {

		cosTheta = saturate( cosTheta );

		float c = 1.0 - cosTheta;
		float c3 = c * c * c;

		return 0.65584461 * c3 + 1.0 / ( 4.16526551 + exp( -7.97291361 * sqrt( alpha ) + 6.33516894 ) );

	}

	float sheenAlbedoScaling( vec3 wo, vec3 wi, SurfaceRecord surf ) {

		float alpha = max( surf.sheenRoughness, 0.07 );
		alpha = alpha * alpha;

		float maxSheenColor = max( max( surf.sheenColor.r, surf.sheenColor.g ), surf.sheenColor.b );

		float eWo = directionalAlbedoSheen( saturateCos( wo.z ), alpha );
		float eWi = directionalAlbedoSheen( saturateCos( wi.z ), alpha );

		return min( 1.0 - maxSheenColor * eWo, 1.0 - maxSheenColor * eWi );

	}

	// See Section 5, Layering, in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
	float sheenAlbedoScaling( vec3 wo, SurfaceRecord surf ) {

		float alpha = max( surf.sheenRoughness, 0.07 );
		alpha = alpha * alpha;

		float maxSheenColor = max( max( surf.sheenColor.r, surf.sheenColor.g ), surf.sheenColor.b );

		float eWo = directionalAlbedoSheen( saturateCos( wo.z ), alpha );

		return 1.0 - maxSheenColor * eWo;

	}

`;var gv=`

#ifndef FOG_CHECK_ITERATIONS
#define FOG_CHECK_ITERATIONS 30
#endif

// returns whether the given material is a fog material or not
bool isMaterialFogVolume( sampler2D materials, uint materialIndex ) {

	uint i = materialIndex * 45u;
	vec4 s14 = texelFetch1D( materials, i + 14u );
	return bool( int( s14.b ) & 4 );

}

// returns true if we're within the first fog volume we hit
bool bvhIntersectFogVolumeHit(
	vec3 rayOrigin, vec3 rayDirection,
	usampler2D materialIndexAttribute, sampler2D materials,
	inout Material material
) {

	material.fogVolume = false;

	for ( int i = 0; i < FOG_CHECK_ITERATIONS; i ++ ) {

		// find nearest hit
		uvec4 faceIndices = uvec4( 0u );
		vec3 faceNormal = vec3( 0.0, 0.0, 1.0 );
		vec3 barycoord = vec3( 0.0 );
		float side = 1.0;
		float dist = 0.0;
		bool hit = bvhIntersectFirstHit( bvh, rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist );
		if ( hit ) {

			// if it's a fog volume return whether we hit the front or back face
			uint materialIndex = uTexelFetch1D( materialIndexAttribute, faceIndices.x ).r;
			if ( isMaterialFogVolume( materials, materialIndex ) ) {

				material = readMaterialInfo( materials, materialIndex );
				return side == - 1.0;

			} else {

				// move the ray forward
				rayOrigin = stepRayOrigin( rayOrigin, rayDirection, - faceNormal, dist );

			}

		} else {

			return false;

		}

	}

	return false;

}

`;var xv=`

	// step through multiple surface hits and accumulate color attenuation based on transmissive surfaces
	// returns true if a solid surface was hit
	bool attenuateHit(
		RenderState state,
		Ray ray, float rayDist,
		out vec3 color
	) {

		// store the original bounce index so we can reset it after
		uint originalBounceIndex = sobolBounceIndex;

		int traversals = state.traversals;
		int transmissiveTraversals = state.transmissiveTraversals;
		bool isShadowRay = state.isShadowRay;
		Material fogMaterial = state.fogMaterial;

		vec3 startPoint = ray.origin;

		// hit results
		SurfaceHit surfaceHit;

		color = vec3( 1.0 );

		bool result = true;
		for ( int i = 0; i < traversals; i ++ ) {

			sobolBounceIndex ++;

			int hitType = traceScene( ray, fogMaterial, surfaceHit );

			if ( hitType == FOG_HIT ) {

				result = true;
				break;

			} else if ( hitType == SURFACE_HIT ) {

				float totalDist = distance( startPoint, ray.origin + ray.direction * surfaceHit.dist );
				if ( totalDist > rayDist ) {

					result = false;
					break;

				}

				// TODO: attenuate the contribution based on the PDF of the resulting ray including refraction values
				// Should be able to work using the material BSDF functions which will take into account specularity, etc.
				// TODO: should we account for emissive surfaces here?

				uint materialIndex = uTexelFetch1D( materialIndexAttribute, surfaceHit.faceIndices.x ).r;
				Material material = readMaterialInfo( materials, materialIndex );

				// adjust the ray to the new surface
				bool isEntering = surfaceHit.side == 1.0;
				ray.origin = stepRayOrigin( ray.origin, ray.direction, - surfaceHit.faceNormal, surfaceHit.dist );

				#if FEATURE_FOG

				if ( material.fogVolume ) {

					fogMaterial = material;
					fogMaterial.fogVolume = surfaceHit.side == 1.0;
					i -= sign( transmissiveTraversals );
					transmissiveTraversals --;
					continue;

				}

				#endif

				if ( ! material.castShadow && isShadowRay ) {

					continue;

				}

				vec2 uv = textureSampleBarycoord( attributesArray, ATTR_UV, surfaceHit.barycoord, surfaceHit.faceIndices.xyz ).xy;
				vec4 vertexColor = textureSampleBarycoord( attributesArray, ATTR_COLOR, surfaceHit.barycoord, surfaceHit.faceIndices.xyz );

				// albedo
				vec4 albedo = vec4( material.color, material.opacity );
				if ( material.map != - 1 ) {

					vec3 uvPrime = material.mapTransform * vec3( uv, 1 );
					albedo *= texture2D( textures, vec3( uvPrime.xy, material.map ) );

				}

				if ( material.vertexColors ) {

					albedo *= vertexColor;

				}

				// alphaMap
				if ( material.alphaMap != - 1 ) {

					albedo.a *= texture2D( textures, vec3( uv, material.alphaMap ) ).x;

				}

				// transmission
				float transmission = material.transmission;
				if ( material.transmissionMap != - 1 ) {

					vec3 uvPrime = material.transmissionMapTransform * vec3( uv, 1 );
					transmission *= texture2D( textures, vec3( uvPrime.xy, material.transmissionMap ) ).r;

				}

				// metalness
				float metalness = material.metalness;
				if ( material.metalnessMap != - 1 ) {

					vec3 uvPrime = material.metalnessMapTransform * vec3( uv, 1 );
					metalness *= texture2D( textures, vec3( uvPrime.xy, material.metalnessMap ) ).b;

				}

				float alphaTest = material.alphaTest;
				bool useAlphaTest = alphaTest != 0.0;
				float transmissionFactor = ( 1.0 - metalness ) * transmission;
				if (
					transmissionFactor < rand( 9 ) && ! (
						// material sidedness
						material.side != 0.0 && surfaceHit.side == material.side

						// alpha test
						|| useAlphaTest && albedo.a < alphaTest

						// opacity
						|| material.transparent && ! useAlphaTest && albedo.a < rand( 10 )
					)
				) {

					result = true;
					break;

				}

				if ( surfaceHit.side == 1.0 && isEntering ) {

					// only attenuate by surface color on the way in
					color *= mix( vec3( 1.0 ), albedo.rgb, transmissionFactor );

				} else if ( surfaceHit.side == - 1.0 ) {

					// attenuate by medium once we hit the opposite side of the model
					color *= transmissionAttenuation( surfaceHit.dist, material.attenuationColor, material.attenuationDistance );

				}

				bool isTransmissiveRay = dot( ray.direction, surfaceHit.faceNormal * surfaceHit.side ) < 0.0;
				if ( ( isTransmissiveRay || isEntering ) && transmissiveTraversals > 0 ) {

					i -= sign( transmissiveTraversals );
					transmissiveTraversals --;

				}

			} else {

				result = false;
				break;

			}

		}

		// reset the bounce index
		sobolBounceIndex = originalBounceIndex;
		return result;

	}

`;var vv=`

	vec3 ndcToRayOrigin( vec2 coord ) {

		vec4 rayOrigin4 = cameraWorldMatrix * invProjectionMatrix * vec4( coord, - 1.0, 1.0 );
		return rayOrigin4.xyz / rayOrigin4.w;
	}

	Ray getCameraRay() {

		vec2 ssd = vec2( 1.0 ) / resolution;

		// Jitter the camera ray by finding a uv coordinate at a random sample
		// around this pixel's UV coordinate for AA
		vec2 ruv = rand2( 0 );
		vec2 jitteredUv = vUv + vec2( tentFilter( ruv.x ) * ssd.x, tentFilter( ruv.y ) * ssd.y );
		Ray ray;

		#if CAMERA_TYPE == 2

			// Equirectangular projection
			vec4 rayDirection4 = vec4( equirectUvToDirection( jitteredUv ), 0.0 );
			vec4 rayOrigin4 = vec4( 0.0, 0.0, 0.0, 1.0 );

			rayDirection4 = cameraWorldMatrix * rayDirection4;
			rayOrigin4 = cameraWorldMatrix * rayOrigin4;

			ray.direction = normalize( rayDirection4.xyz );
			ray.origin = rayOrigin4.xyz / rayOrigin4.w;

		#else

			// get [- 1, 1] normalized device coordinates
			vec2 ndc = 2.0 * jitteredUv - vec2( 1.0 );
			ray.origin = ndcToRayOrigin( ndc );

			#if CAMERA_TYPE == 1

				// Orthographic projection
				ray.direction = ( cameraWorldMatrix * vec4( 0.0, 0.0, - 1.0, 0.0 ) ).xyz;
				ray.direction = normalize( ray.direction );

			#else

				// Perspective projection
				ray.direction = normalize( mat3( cameraWorldMatrix ) * ( invProjectionMatrix * vec4( ndc, 0.0, 1.0 ) ).xyz );

			#endif

		#endif

		#if FEATURE_DOF
		{

			// depth of field
			vec3 focalPoint = ray.origin + normalize( ray.direction ) * physicalCamera.focusDistance;

			// get the aperture sample
			// if blades === 0 then we assume a circle
			vec3 shapeUVW= rand3( 1 );
			int blades = physicalCamera.apertureBlades;
			float anamorphicRatio = physicalCamera.anamorphicRatio;
			vec2 apertureSample = blades == 0 ? sampleCircle( shapeUVW.xy ) : sampleRegularPolygon( blades, shapeUVW );
			apertureSample *= physicalCamera.bokehSize * 0.5 * 1e-3;

			// rotate the aperture shape
			apertureSample =
				rotateVector( apertureSample, physicalCamera.apertureRotation ) *
				saturate( vec2( anamorphicRatio, 1.0 / anamorphicRatio ) );

			// create the new ray
			ray.origin += ( cameraWorldMatrix * vec4( apertureSample, 0.0, 0.0 ) ).xyz;
			ray.direction = focalPoint - ray.origin;

		}
		#endif

		ray.direction = normalize( ray.direction );

		return ray;

	}

`;var _v=`

	vec3 directLightContribution( vec3 worldWo, SurfaceRecord surf, RenderState state, vec3 rayOrigin ) {

		vec3 result = vec3( 0.0 );

		// uniformly pick a light or environment map
		if( lightsDenom != 0.0 && rand( 5 ) < float( lights.count ) / lightsDenom ) {

			// sample a light or environment
			LightRecord lightRec = randomLightSample( lights.tex, iesProfiles, lights.count, rayOrigin, rand3( 6 ) );

			bool isSampleBelowSurface = ! surf.volumeParticle && dot( surf.faceNormal, lightRec.direction ) < 0.0;
			if ( isSampleBelowSurface ) {

				lightRec.pdf = 0.0;

			}

			// check if a ray could even reach the light area
			Ray lightRay;
			lightRay.origin = rayOrigin;
			lightRay.direction = lightRec.direction;
			vec3 attenuatedColor;
			if (
				lightRec.pdf > 0.0 &&
				isDirectionValid( lightRec.direction, surf.normal, surf.faceNormal ) &&
				! attenuateHit( state, lightRay, lightRec.dist, attenuatedColor )
			) {

				// get the material pdf
				vec3 sampleColor;
				float lightMaterialPdf = bsdfResult( worldWo, lightRec.direction, surf, sampleColor );
				bool isValidSampleColor = all( greaterThanEqual( sampleColor, vec3( 0.0 ) ) );
				if ( lightMaterialPdf > 0.0 && isValidSampleColor ) {

					// weight the direct light contribution
					float lightPdf = lightRec.pdf / lightsDenom;
					float misWeight = lightRec.type == SPOT_LIGHT_TYPE || lightRec.type == DIR_LIGHT_TYPE || lightRec.type == POINT_LIGHT_TYPE ? 1.0 : misHeuristic( lightPdf, lightMaterialPdf );
					result = attenuatedColor * lightRec.emission * state.throughputColor * sampleColor * misWeight / lightPdf;

				}

			}

		} else if ( envMapInfo.totalSum != 0.0 && environmentIntensity != 0.0 ) {

			// find a sample in the environment map to include in the contribution
			vec3 envColor, envDirection;
			float envPdf = sampleEquirectProbability( rand2( 7 ), envColor, envDirection );
			envDirection = invEnvRotation3x3 * envDirection;

			// this env sampling is not set up for transmissive sampling and yields overly bright
			// results so we ignore the sample in this case.
			// TODO: this should be improved but how? The env samples could traverse a few layers?
			bool isSampleBelowSurface = ! surf.volumeParticle && dot( surf.faceNormal, envDirection ) < 0.0;
			if ( isSampleBelowSurface ) {

				envPdf = 0.0;

			}

			// check if a ray could even reach the surface
			Ray envRay;
			envRay.origin = rayOrigin;
			envRay.direction = envDirection;
			vec3 attenuatedColor;
			if (
				envPdf > 0.0 &&
				isDirectionValid( envDirection, surf.normal, surf.faceNormal ) &&
				! attenuateHit( state, envRay, INFINITY, attenuatedColor )
			) {

				// get the material pdf
				vec3 sampleColor;
				float envMaterialPdf = bsdfResult( worldWo, envDirection, surf, sampleColor );
				bool isValidSampleColor = all( greaterThanEqual( sampleColor, vec3( 0.0 ) ) );
				if ( envMaterialPdf > 0.0 && isValidSampleColor ) {

					// weight the direct light contribution
					envPdf /= lightsDenom;
					float misWeight = misHeuristic( envPdf, envMaterialPdf );
					result = attenuatedColor * environmentIntensity * envColor * state.throughputColor * sampleColor * misWeight / envPdf;

				}

			}

		}

		// Function changed to have a single return statement to potentially help with crashes on Mac OS.
		// See issue #470
		return result;

	}

`;var yv=`

	#define SKIP_SURFACE 0
	#define HIT_SURFACE 1
	int getSurfaceRecord(
		Material material, SurfaceHit surfaceHit, sampler2DArray attributesArray,
		float accumulatedRoughness,
		inout SurfaceRecord surf
	) {

		if ( material.fogVolume ) {

			vec3 normal = vec3( 0, 0, 1 );

			SurfaceRecord fogSurface;
			fogSurface.volumeParticle = true;
			fogSurface.color = material.color;
			fogSurface.emission = material.emissiveIntensity * material.emissive;
			fogSurface.normal = normal;
			fogSurface.faceNormal = normal;
			fogSurface.clearcoatNormal = normal;

			surf = fogSurface;
			return HIT_SURFACE;

		}

		// uv coord for textures
		vec2 uv = textureSampleBarycoord( attributesArray, ATTR_UV, surfaceHit.barycoord, surfaceHit.faceIndices.xyz ).xy;
		vec4 vertexColor = textureSampleBarycoord( attributesArray, ATTR_COLOR, surfaceHit.barycoord, surfaceHit.faceIndices.xyz );

		// albedo
		vec4 albedo = vec4( material.color, material.opacity );
		if ( material.map != - 1 ) {

			vec3 uvPrime = material.mapTransform * vec3( uv, 1 );
			albedo *= texture2D( textures, vec3( uvPrime.xy, material.map ) );

		}

		if ( material.vertexColors ) {

			albedo *= vertexColor;

		}

		// alphaMap
		if ( material.alphaMap != - 1 ) {

			albedo.a *= texture2D( textures, vec3( uv, material.alphaMap ) ).x;

		}

		// possibly skip this sample if it's transparent, alpha test is enabled, or we hit the wrong material side
		// and it's single sided.
		// - alpha test is disabled when it === 0
		// - the material sidedness test is complicated because we want light to pass through the back side but still
		// be able to see the front side. This boolean checks if the side we hit is the front side on the first ray
		// and we're rendering the other then we skip it. Do the opposite on subsequent bounces to get incoming light.
		float alphaTest = material.alphaTest;
		bool useAlphaTest = alphaTest != 0.0;
		if (
			// material sidedness
			material.side != 0.0 && surfaceHit.side != material.side

			// alpha test
			|| useAlphaTest && albedo.a < alphaTest

			// opacity
			|| material.transparent && ! useAlphaTest && albedo.a < rand( 3 )
		) {

			return SKIP_SURFACE;

		}

		// fetch the interpolated smooth normal
		vec3 normal = normalize( textureSampleBarycoord(
			attributesArray,
			ATTR_NORMAL,
			surfaceHit.barycoord,
			surfaceHit.faceIndices.xyz
		).xyz );

		// roughness
		float roughness = material.roughness;
		if ( material.roughnessMap != - 1 ) {

			vec3 uvPrime = material.roughnessMapTransform * vec3( uv, 1 );
			roughness *= texture2D( textures, vec3( uvPrime.xy, material.roughnessMap ) ).g;

		}

		// metalness
		float metalness = material.metalness;
		if ( material.metalnessMap != - 1 ) {

			vec3 uvPrime = material.metalnessMapTransform * vec3( uv, 1 );
			metalness *= texture2D( textures, vec3( uvPrime.xy, material.metalnessMap ) ).b;

		}

		// emission
		vec3 emission = material.emissiveIntensity * material.emissive;
		if ( material.emissiveMap != - 1 ) {

			vec3 uvPrime = material.emissiveMapTransform * vec3( uv, 1 );
			emission *= texture2D( textures, vec3( uvPrime.xy, material.emissiveMap ) ).xyz;

		}

		// transmission
		float transmission = material.transmission;
		if ( material.transmissionMap != - 1 ) {

			vec3 uvPrime = material.transmissionMapTransform * vec3( uv, 1 );
			transmission *= texture2D( textures, vec3( uvPrime.xy, material.transmissionMap ) ).r;

		}

		// normal
		if ( material.flatShading ) {

			// if we're rendering a flat shaded object then use the face normals - the face normal
			// is provided based on the side the ray hits the mesh so flip it to align with the
			// interpolated vertex normals.
			normal = surfaceHit.faceNormal * surfaceHit.side;

		}

		vec3 baseNormal = normal;
		if ( material.normalMap != - 1 ) {

			vec4 tangentSample = textureSampleBarycoord(
				attributesArray,
				ATTR_TANGENT,
				surfaceHit.barycoord,
				surfaceHit.faceIndices.xyz
			);

			// some provided tangents can be malformed (0, 0, 0) causing the normal to be degenerate
			// resulting in NaNs and slow path tracing.
			if ( length( tangentSample.xyz ) > 0.0 ) {

				vec3 tangent = normalize( tangentSample.xyz );
				vec3 bitangent = normalize( cross( normal, tangent ) * tangentSample.w );
				mat3 vTBN = mat3( tangent, bitangent, normal );

				vec3 uvPrime = material.normalMapTransform * vec3( uv, 1 );
				vec3 texNormal = texture2D( textures, vec3( uvPrime.xy, material.normalMap ) ).xyz * 2.0 - 1.0;
				texNormal.xy *= material.normalScale;
				normal = vTBN * texNormal;

			}

		}

		normal *= surfaceHit.side;

		// clearcoat
		float clearcoat = material.clearcoat;
		if ( material.clearcoatMap != - 1 ) {

			vec3 uvPrime = material.clearcoatMapTransform * vec3( uv, 1 );
			clearcoat *= texture2D( textures, vec3( uvPrime.xy, material.clearcoatMap ) ).r;

		}

		// clearcoatRoughness
		float clearcoatRoughness = material.clearcoatRoughness;
		if ( material.clearcoatRoughnessMap != - 1 ) {

			vec3 uvPrime = material.clearcoatRoughnessMapTransform * vec3( uv, 1 );
			clearcoatRoughness *= texture2D( textures, vec3( uvPrime.xy, material.clearcoatRoughnessMap ) ).g;

		}

		// clearcoatNormal
		vec3 clearcoatNormal = baseNormal;
		if ( material.clearcoatNormalMap != - 1 ) {

			vec4 tangentSample = textureSampleBarycoord(
				attributesArray,
				ATTR_TANGENT,
				surfaceHit.barycoord,
				surfaceHit.faceIndices.xyz
			);

			// some provided tangents can be malformed (0, 0, 0) causing the normal to be degenerate
			// resulting in NaNs and slow path tracing.
			if ( length( tangentSample.xyz ) > 0.0 ) {

				vec3 tangent = normalize( tangentSample.xyz );
				vec3 bitangent = normalize( cross( clearcoatNormal, tangent ) * tangentSample.w );
				mat3 vTBN = mat3( tangent, bitangent, clearcoatNormal );

				vec3 uvPrime = material.clearcoatNormalMapTransform * vec3( uv, 1 );
				vec3 texNormal = texture2D( textures, vec3( uvPrime.xy, material.clearcoatNormalMap ) ).xyz * 2.0 - 1.0;
				texNormal.xy *= material.clearcoatNormalScale;
				clearcoatNormal = vTBN * texNormal;

			}

		}

		clearcoatNormal *= surfaceHit.side;

		// sheenColor
		vec3 sheenColor = material.sheenColor;
		if ( material.sheenColorMap != - 1 ) {

			vec3 uvPrime = material.sheenColorMapTransform * vec3( uv, 1 );
			sheenColor *= texture2D( textures, vec3( uvPrime.xy, material.sheenColorMap ) ).rgb;

		}

		// sheenRoughness
		float sheenRoughness = material.sheenRoughness;
		if ( material.sheenRoughnessMap != - 1 ) {

			vec3 uvPrime = material.sheenRoughnessMapTransform * vec3( uv, 1 );
			sheenRoughness *= texture2D( textures, vec3( uvPrime.xy, material.sheenRoughnessMap ) ).a;

		}

		// iridescence
		float iridescence = material.iridescence;
		if ( material.iridescenceMap != - 1 ) {

			vec3 uvPrime = material.iridescenceMapTransform * vec3( uv, 1 );
			iridescence *= texture2D( textures, vec3( uvPrime.xy, material.iridescenceMap ) ).r;

		}

		// iridescence thickness
		float iridescenceThickness = material.iridescenceThicknessMaximum;
		if ( material.iridescenceThicknessMap != - 1 ) {

			vec3 uvPrime = material.iridescenceThicknessMapTransform * vec3( uv, 1 );
			float iridescenceThicknessSampled = texture2D( textures, vec3( uvPrime.xy, material.iridescenceThicknessMap ) ).g;
			iridescenceThickness = mix( material.iridescenceThicknessMinimum, material.iridescenceThicknessMaximum, iridescenceThicknessSampled );

		}

		iridescence = iridescenceThickness == 0.0 ? 0.0 : iridescence;

		// specular color
		vec3 specularColor = material.specularColor;
		if ( material.specularColorMap != - 1 ) {

			vec3 uvPrime = material.specularColorMapTransform * vec3( uv, 1 );
			specularColor *= texture2D( textures, vec3( uvPrime.xy, material.specularColorMap ) ).rgb;

		}

		// specular intensity
		float specularIntensity = material.specularIntensity;
		if ( material.specularIntensityMap != - 1 ) {

			vec3 uvPrime = material.specularIntensityMapTransform * vec3( uv, 1 );
			specularIntensity *= texture2D( textures, vec3( uvPrime.xy, material.specularIntensityMap ) ).a;

		}

		surf.volumeParticle = false;

		surf.faceNormal = surfaceHit.faceNormal;
		surf.normal = normal;

		surf.metalness = metalness;
		surf.color = albedo.rgb;
		surf.emission = emission;

		surf.ior = material.ior;
		surf.transmission = transmission;
		surf.thinFilm = material.thinFilm;
		surf.attenuationColor = material.attenuationColor;
		surf.attenuationDistance = material.attenuationDistance;

		surf.clearcoatNormal = clearcoatNormal;
		surf.clearcoat = clearcoat;

		surf.sheen = material.sheen;
		surf.sheenColor = sheenColor;

		surf.iridescence = iridescence;
		surf.iridescenceIor = material.iridescenceIor;
		surf.iridescenceThickness = iridescenceThickness;

		surf.specularColor = specularColor;
		surf.specularIntensity = specularIntensity;

		// apply perceptual roughness factor from gltf. sheen perceptual roughness is
		// applied by its brdf function
		// https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#microfacet-surfaces
		surf.roughness = roughness * roughness;
		surf.clearcoatRoughness = clearcoatRoughness * clearcoatRoughness;
		surf.sheenRoughness = sheenRoughness;

		// frontFace is used to determine transmissive properties and PDF. If no transmission is used
		// then we can just always assume this is a front face.
		surf.frontFace = surfaceHit.side == 1.0 || transmission == 0.0;
		surf.eta = material.thinFilm || surf.frontFace ? 1.0 / material.ior : material.ior;
		surf.f0 = iorRatioToF0( surf.eta );

		// Compute the filtered roughness value to use during specular reflection computations.
		// The accumulated roughness value is scaled by a user setting and a "magic value" of 5.0.
		// If we're exiting something transmissive then scale the factor down significantly so we can retain
		// sharp internal reflections
		surf.filteredRoughness = applyFilteredGlossy( surf.roughness, accumulatedRoughness );
		surf.filteredClearcoatRoughness = applyFilteredGlossy( surf.clearcoatRoughness, accumulatedRoughness );

		// get the normal frames
		surf.normalBasis = getBasisFromNormal( surf.normal );
		surf.normalInvBasis = inverse( surf.normalBasis );

		surf.clearcoatBasis = getBasisFromNormal( surf.clearcoatNormal );
		surf.clearcoatInvBasis = inverse( surf.clearcoatBasis );

		return HIT_SURFACE;

	}
`;var bv=`

	struct Ray {

		vec3 origin;
		vec3 direction;

	};

	struct SurfaceHit {

		uvec4 faceIndices;
		vec3 barycoord;
		vec3 faceNormal;
		float side;
		float dist;

	};

	struct RenderState {

		bool firstRay;
		bool transmissiveRay;
		bool isShadowRay;
		float accumulatedRoughness;
		int transmissiveTraversals;
		int traversals;
		uint depth;
		vec3 throughputColor;
		Material fogMaterial;

	};

	RenderState initRenderState() {

		RenderState result;
		result.firstRay = true;
		result.transmissiveRay = true;
		result.isShadowRay = false;
		result.accumulatedRoughness = 0.0;
		result.transmissiveTraversals = 0;
		result.traversals = 0;
		result.throughputColor = vec3( 1.0 );
		result.depth = 0u;
		result.fogMaterial.fogVolume = false;
		return result;

	}

`;var Mv=`

	#define NO_HIT 0
	#define SURFACE_HIT 1
	#define LIGHT_HIT 2
	#define FOG_HIT 3

	// Passing the global variable 'lights' into this function caused shader program errors.
	// So global variables like 'lights' and 'bvh' were moved out of the function parameters.
	// For more information, refer to: https://github.com/gkjohnson/three-gpu-pathtracer/pull/457
	int traceScene(
		Ray ray, Material fogMaterial, inout SurfaceHit surfaceHit
	) {

		int result = NO_HIT;
		bool hit = bvhIntersectFirstHit( bvh, ray.origin, ray.direction, surfaceHit.faceIndices, surfaceHit.faceNormal, surfaceHit.barycoord, surfaceHit.side, surfaceHit.dist );

		#if FEATURE_FOG

		if ( fogMaterial.fogVolume ) {

			// offset the distance so we don't run into issues with particles on the same surface
			// as other objects
			float particleDist = intersectFogVolume( fogMaterial, rand( 1 ) );
			if ( particleDist + RAY_OFFSET < surfaceHit.dist ) {

				surfaceHit.side = 1.0;
				surfaceHit.faceNormal = normalize( - ray.direction );
				surfaceHit.dist = particleDist;
				return FOG_HIT;

			}

		}

		#endif

		if ( hit ) {

			result = SURFACE_HIT;

		}

		return result;

	}

`;var ah=class extends Pn{onBeforeRender(){this.setDefine("FEATURE_DOF",this.physicalCamera.bokehSize===0?0:1),this.setDefine("FEATURE_BACKGROUND_MAP",this.backgroundMap?1:0),this.setDefine("FEATURE_FOG",this.materials.features.isUsed("FOG")?1:0)}constructor(t){super({transparent:!0,depthWrite:!1,defines:{FEATURE_MIS:1,FEATURE_RUSSIAN_ROULETTE:1,FEATURE_DOF:1,FEATURE_BACKGROUND_MAP:0,FEATURE_FOG:1,RANDOM_TYPE:2,CAMERA_TYPE:0,DEBUG_MODE:0,ATTR_NORMAL:0,ATTR_TANGENT:1,ATTR_UV:2,ATTR_COLOR:3},uniforms:{resolution:{value:new X},opacity:{value:1},bounces:{value:10},transmissiveBounces:{value:10},filterGlossyFactor:{value:0},physicalCamera:{value:new $u},cameraWorldMatrix:{value:new dt},invProjectionMatrix:{value:new dt},bvh:{value:new Fu},attributesArray:{value:new ju},materialIndexAttribute:{value:new Gs},materials:{value:new eh},textures:{value:new Ta().texture},lights:{value:new Ku},iesProfiles:{value:new Ta(360,180,{type:me,wrapS:ge,wrapT:ge}).texture},environmentIntensity:{value:1},environmentRotation:{value:new dt},envMapInfo:{value:new Ju},backgroundBlur:{value:0},backgroundMap:{value:null},backgroundAlpha:{value:1},backgroundIntensity:{value:1},backgroundRotation:{value:new dt},seed:{value:0},sobolTexture:{value:null},stratifiedTexture:{value:new rh},stratifiedOffsetTexture:{value:new oh(64,1)}},vertexShader:`

				varying vec2 vUv;
				void main() {

					vec4 mvPosition = vec4( position, 1.0 );
					mvPosition = modelViewMatrix * mvPosition;
					gl_Position = projectionMatrix * mvPosition;

					vUv = uv;

				}

			`,fragmentShader:`
				#define RAY_OFFSET 1e-4
				#define INFINITY 1e20

				precision highp isampler2D;
				precision highp usampler2D;
				precision highp sampler2DArray;
				vec4 envMapTexelToLinear( vec4 a ) { return a; }
				#include <common>

				// bvh intersection
				${Dr.common_functions}
				${Dr.bvh_struct_definitions}
				${Dr.bvh_ray_functions}

				// uniform structs
				${Qx}
				${tv}
				${jx}
				${ev}
				${nv}

				// random
				#if RANDOM_TYPE == 2 	// Stratified List

					${uv}

				#elif RANDOM_TYPE == 1 	// Sobol

					${Dp}
					${qu}
					${zx}

					#define rand(v) sobol(v)
					#define rand2(v) sobol2(v)
					#define rand3(v) sobol3(v)
					#define rand4(v) sobol4(v)

				#else 					// PCG

				${Dp}

					// Using the sobol functions seems to break the the compiler on MacOS
					// - specifically the "sobolReverseBits" function.
					uint sobolPixelIndex = 0u;
					uint sobolPathIndex = 0u;
					uint sobolBounceIndex = 0u;

					#define rand(v) pcgRand()
					#define rand2(v) pcgRand2()
					#define rand3(v) pcgRand3()
					#define rand4(v) pcgRand4()

				#endif

				// common
				${lv}
				${ov}
				${Zs}
				${av}
				${cv}

				// environment
				uniform EquirectHdrInfo envMapInfo;
				uniform mat4 environmentRotation;
				uniform float environmentIntensity;

				// lighting
				uniform sampler2DArray iesProfiles;
				uniform LightsInfo lights;

				// background
				uniform float backgroundBlur;
				uniform float backgroundAlpha;
				#if FEATURE_BACKGROUND_MAP

				uniform sampler2D backgroundMap;
				uniform mat4 backgroundRotation;
				uniform float backgroundIntensity;

				#endif

				// camera
				uniform mat4 cameraWorldMatrix;
				uniform mat4 invProjectionMatrix;
				#if FEATURE_DOF

				uniform PhysicalCamera physicalCamera;

				#endif

				// geometry
				uniform sampler2DArray attributesArray;
				uniform usampler2D materialIndexAttribute;
				uniform sampler2D materials;
				uniform sampler2DArray textures;
				uniform BVH bvh;

				// path tracer
				uniform int bounces;
				uniform int transmissiveBounces;
				uniform float filterGlossyFactor;
				uniform int seed;

				// image
				uniform vec2 resolution;
				uniform float opacity;

				varying vec2 vUv;

				// globals
				mat3 envRotation3x3;
				mat3 invEnvRotation3x3;
				float lightsDenom;

				// sampling
				${sv}
				${iv}
				${rv}

				${gv}
				${dv}
				${mv}
				${pv}
				${fv}
				${hv}

				float applyFilteredGlossy( float roughness, float accumulatedRoughness ) {

					return clamp(
						max(
							roughness,
							accumulatedRoughness * filterGlossyFactor * 5.0 ),
						0.0,
						1.0
					);

				}

				vec3 sampleBackground( vec3 direction, vec2 uv ) {

					vec3 sampleDir = sampleHemisphere( direction, uv ) * 0.5 * backgroundBlur;

					#if FEATURE_BACKGROUND_MAP

					sampleDir = normalize( mat3( backgroundRotation ) * direction + sampleDir );
					return backgroundIntensity * sampleEquirectColor( backgroundMap, sampleDir );

					#else

					sampleDir = normalize( envRotation3x3 * direction + sampleDir );
					return environmentIntensity * sampleEquirectColor( envMapInfo.map, sampleDir );

					#endif

				}

				${bv}
				${vv}
				${Mv}
				${xv}
				${_v}
				${yv}

				void main() {

					// init
					rng_initialize( gl_FragCoord.xy, seed );
					sobolPixelIndex = ( uint( gl_FragCoord.x ) << 16 ) | uint( gl_FragCoord.y );
					sobolPathIndex = uint( seed );

					// get camera ray
					Ray ray = getCameraRay();

					// inverse environment rotation
					envRotation3x3 = mat3( environmentRotation );
					invEnvRotation3x3 = inverse( envRotation3x3 );
					lightsDenom =
						( environmentIntensity == 0.0 || envMapInfo.totalSum == 0.0 ) && lights.count != 0u ?
							float( lights.count ) :
							float( lights.count + 1u );

					// final color
					gl_FragColor = vec4( 0, 0, 0, 1 );

					// surface results
					SurfaceHit surfaceHit;
					ScatterRecord scatterRec;

					// path tracing state
					RenderState state = initRenderState();
					state.transmissiveTraversals = transmissiveBounces;
					#if FEATURE_FOG

					state.fogMaterial.fogVolume = bvhIntersectFogVolumeHit(
						ray.origin, - ray.direction,
						materialIndexAttribute, materials,
						state.fogMaterial
					);

					#endif

					for ( int i = 0; i < bounces; i ++ ) {

						sobolBounceIndex ++;

						state.depth ++;
						state.traversals = bounces - i;
						state.firstRay = i == 0 && state.transmissiveTraversals == transmissiveBounces;

						int hitType = traceScene( ray, state.fogMaterial, surfaceHit );

						// check if we intersect any lights and accumulate the light contribution
						// TODO: we can add support for light surface rendering in the else condition if we
						// add the ability to toggle visibility of the the light
						if ( ! state.firstRay && ! state.transmissiveRay ) {

							LightRecord lightRec;
							float lightDist = hitType == NO_HIT ? INFINITY : surfaceHit.dist;
							for ( uint i = 0u; i < lights.count; i ++ ) {

								if (
									intersectLightAtIndex( lights.tex, ray.origin, ray.direction, i, lightRec ) &&
									lightRec.dist < lightDist
								) {

									#if FEATURE_MIS

									// weight the contribution
									// NOTE: Only area lights are supported for forward sampling and can be hit
									float misWeight = misHeuristic( scatterRec.pdf, lightRec.pdf / lightsDenom );
									gl_FragColor.rgb += lightRec.emission * state.throughputColor * misWeight;

									#else

									gl_FragColor.rgb += lightRec.emission * state.throughputColor;

									#endif

								}

							}

						}

						if ( hitType == NO_HIT ) {

							if ( state.firstRay || state.transmissiveRay ) {

								gl_FragColor.rgb += sampleBackground( ray.direction, rand2( 2 ) ) * state.throughputColor;
								gl_FragColor.a = backgroundAlpha;

							} else {

								#if FEATURE_MIS

								// get the PDF of the hit envmap point
								vec3 envColor;
								float envPdf = sampleEquirect( envRotation3x3 * ray.direction, envColor );
								envPdf /= lightsDenom;

								// and weight the contribution
								float misWeight = misHeuristic( scatterRec.pdf, envPdf );
								gl_FragColor.rgb += environmentIntensity * envColor * state.throughputColor * misWeight;

								#else

								gl_FragColor.rgb +=
									environmentIntensity *
									sampleEquirectColor( envMapInfo.map, envRotation3x3 * ray.direction ) *
									state.throughputColor;

								#endif

							}
							break;

						}

						uint materialIndex = uTexelFetch1D( materialIndexAttribute, surfaceHit.faceIndices.x ).r;
						Material material = readMaterialInfo( materials, materialIndex );

						#if FEATURE_FOG

						if ( hitType == FOG_HIT ) {

							material = state.fogMaterial;
							state.accumulatedRoughness += 0.2;

						} else if ( material.fogVolume ) {

							state.fogMaterial = material;
							state.fogMaterial.fogVolume = surfaceHit.side == 1.0;

							ray.origin = stepRayOrigin( ray.origin, ray.direction, - surfaceHit.faceNormal, surfaceHit.dist );

							i -= sign( state.transmissiveTraversals );
							state.transmissiveTraversals -= sign( state.transmissiveTraversals );
							continue;

						}

						#endif

						// early out if this is a matte material
						if ( material.matte && state.firstRay ) {

							gl_FragColor = vec4( 0.0 );
							break;

						}

						// if we've determined that this is a shadow ray and we've hit an item with no shadow casting
						// then skip it
						if ( ! material.castShadow && state.isShadowRay ) {

							ray.origin = stepRayOrigin( ray.origin, ray.direction, - surfaceHit.faceNormal, surfaceHit.dist );
							continue;

						}

						SurfaceRecord surf;
						if (
							getSurfaceRecord(
								material, surfaceHit, attributesArray, state.accumulatedRoughness,
								surf
							) == SKIP_SURFACE
						) {

							// only allow a limited number of transparency discards otherwise we could
							// crash the context with too long a loop.
							i -= sign( state.transmissiveTraversals );
							state.transmissiveTraversals -= sign( state.transmissiveTraversals );

							ray.origin = stepRayOrigin( ray.origin, ray.direction, - surfaceHit.faceNormal, surfaceHit.dist );
							continue;

						}

						scatterRec = bsdfSample( - ray.direction, surf );
						state.isShadowRay = scatterRec.specularPdf < rand( 4 );

						bool isBelowSurface = ! surf.volumeParticle && dot( scatterRec.direction, surf.faceNormal ) < 0.0;
						vec3 hitPoint = stepRayOrigin( ray.origin, ray.direction, isBelowSurface ? - surf.faceNormal : surf.faceNormal, surfaceHit.dist );

						// next event estimation
						#if FEATURE_MIS

						gl_FragColor.rgb += directLightContribution( - ray.direction, surf, state, hitPoint );

						#endif

						// accumulate a roughness value to offset diffuse, specular, diffuse rays that have high contribution
						// to a single pixel resulting in fireflies
						// TODO: handle transmissive surfaces
						if ( ! surf.volumeParticle && ! isBelowSurface ) {

							// determine if this is a rough normal or not by checking how far off straight up it is
							vec3 halfVector = normalize( - ray.direction + scatterRec.direction );
							state.accumulatedRoughness += max(
								sin( acosApprox( dot( halfVector, surf.normal ) ) ),
								sin( acosApprox( dot( halfVector, surf.clearcoatNormal ) ) )
							);

							state.transmissiveRay = false;

						}

						// accumulate emissive color
						gl_FragColor.rgb += ( surf.emission * state.throughputColor );

						// skip the sample if our PDF or ray is impossible
						if ( scatterRec.pdf <= 0.0 || ! isDirectionValid( scatterRec.direction, surf.normal, surf.faceNormal ) ) {

							break;

						}

						// if we're bouncing around the inside a transmissive material then decrement
						// perform this separate from a bounce
						bool isTransmissiveRay = ! surf.volumeParticle && dot( scatterRec.direction, surf.faceNormal * surfaceHit.side ) < 0.0;
						if ( ( isTransmissiveRay || isBelowSurface ) && state.transmissiveTraversals > 0 ) {

							state.transmissiveTraversals --;
							i --;

						}

						//

						// handle throughput color transformation
						// attenuate the throughput color by the medium color
						if ( ! surf.frontFace ) {

							state.throughputColor *= transmissionAttenuation( surfaceHit.dist, surf.attenuationColor, surf.attenuationDistance );

						}

						#if FEATURE_RUSSIAN_ROULETTE

						// russian roulette path termination
						// https://www.arnoldrenderer.com/research/physically_based_shader_design_in_arnold.pdf
						uint minBounces = 3u;
						float depthProb = float( state.depth < minBounces );

						float rrProb = luminance( state.throughputColor * scatterRec.color / scatterRec.pdf );
						rrProb /= luminance( state.throughputColor );
						rrProb = sqrt( rrProb );
						rrProb = max( rrProb, depthProb );
						rrProb = min( rrProb, 1.0 );
						if ( rand( 8 ) > rrProb ) {

							break;

						}

						// perform sample clamping here to avoid bright pixels
						state.throughputColor *= min( 1.0 / rrProb, 20.0 );

						#endif

						// adjust the throughput and discard and exit if we find discard the sample if there are any NaNs
						state.throughputColor *= scatterRec.color / scatterRec.pdf;
						if ( any( isnan( state.throughputColor ) ) || any( isinf( state.throughputColor ) ) ) {

							break;

						}

						//

						// prepare for next ray
						ray.direction = scatterRec.direction;
						ray.origin = hitPoint;

					}

					gl_FragColor.a *= opacity;

					#if DEBUG_MODE == 1

					// output the number of rays checked in the path and number of
					// transmissive rays encountered.
					gl_FragColor.rgb = vec3(
						float( state.depth ),
						transmissiveBounces - state.transmissiveTraversals,
						0.0
					);
					gl_FragColor.a = 1.0;

					#endif

				}

			`}),this.setValues(t)}};function*A1(){let{_renderer:r,_fsQuad:t,_blendQuad:e,_primaryTarget:n,_blendTargets:i,_sobolTarget:s,_subframe:o,alpha:a,material:c}=this,l=new Kt,h=new Kt,f=e.material,[u,d]=i;for(;;){a?(f.opacity=this._opacityFactor/(this.samples+1),c.blending=Ne,c.opacity=1):(c.opacity=this._opacityFactor/(this.samples+1),c.blending=On);let[g,x,p,m]=o,_=n.width,v=n.height;c.resolution.set(_*p,v*m),c.sobolTexture=s.texture,c.stratifiedTexture.init(20,c.bounces+c.transmissiveBounces+5),c.stratifiedTexture.next(),c.seed++;let y=this.tiles.x||1,w=this.tiles.y||1,S=y*w,T=Math.ceil(_*p),A=Math.ceil(v*m),M=Math.floor(g*_),b=Math.floor(x*v),I=Math.ceil(T/y),D=Math.ceil(A/w);for(let F=0;F<w;F++)for(let N=0;N<y;N++){let k=r.getRenderTarget(),U=r.autoClear,$=r.getScissorTest();r.getScissor(l),r.getViewport(h);let W=N,st=F;if(!this.stableTiles){let gt=this._currentTile%(y*w);W=gt%y,st=~~(gt/y),this._currentTile=gt+1}let lt=w-st-1;n.scissor.set(M+W*I,b+lt*D,Math.min(I,T-W*I),Math.min(D,A-lt*D)),n.viewport.set(M,b,T,A),r.setRenderTarget(n),r.setScissorTest(!0),r.autoClear=!1,t.render(r),r.setViewport(h),r.setScissor(l),r.setScissorTest($),r.setRenderTarget(k),r.autoClear=U,a&&(f.target1=u.texture,f.target2=n.texture,r.setRenderTarget(d),e.render(r),r.setRenderTarget(k)),this.samples+=1/S,N===y-1&&F===w-1&&(this.samples=Math.round(this.samples)),yield}[u,d]=[d,u]}}var Tv=new at,Aa=class{get material(){return this._fsQuad.material}set material(t){this._fsQuad.material.removeEventListener("recompilation",this._compileFunction),t.addEventListener("recompilation",this._compileFunction),this._fsQuad.material=t}get target(){return this._alpha?this._blendTargets[1]:this._primaryTarget}set alpha(t){this._alpha!==t&&(t||(this._blendTargets[0].dispose(),this._blendTargets[1].dispose()),this._alpha=t,this.reset())}get alpha(){return this._alpha}get isCompiling(){return!!this._compilePromise}constructor(t){this.camera=null,this.tiles=new X(3,3),this.stableNoise=!1,this.stableTiles=!0,this.samples=0,this._subframe=new Kt(0,0,1,1),this._opacityFactor=1,this._renderer=t,this._alpha=!1,this._fsQuad=new Ke(new ah),this._blendQuad=new Ke(new Gu),this._task=null,this._currentTile=0,this._compilePromise=null,this._sobolTarget=new Yu().generate(t),this._primaryTarget=new be(1,1,{format:Lt,type:Dt,magFilter:Nt,minFilter:Nt}),this._blendTargets=[new be(1,1,{format:Lt,type:Dt,magFilter:Nt,minFilter:Nt}),new be(1,1,{format:Lt,type:Dt,magFilter:Nt,minFilter:Nt})],this._compileFunction=()=>{let e=this.compileMaterial(this._fsQuad._mesh);e.then(()=>{this._compilePromise===e&&(this._compilePromise=null)}),this._compilePromise=e},this.material.addEventListener("recompilation",this._compileFunction)}compileMaterial(){return this._renderer.compileAsync(this._fsQuad._mesh)}setCamera(t){let{material:e}=this;e.cameraWorldMatrix.copy(t.matrixWorld),e.invProjectionMatrix.copy(t.projectionMatrixInverse),e.physicalCamera.updateFrom(t);let n=0;t.projectionMatrix.elements[15]>0&&(n=1),t.isEquirectCamera&&(n=2),e.setDefine("CAMERA_TYPE",n),this.camera=t}setSize(t,e){t=Math.ceil(t),e=Math.ceil(e),!(this._primaryTarget.width===t&&this._primaryTarget.height===e)&&(this._primaryTarget.setSize(t,e),this._blendTargets[0].setSize(t,e),this._blendTargets[1].setSize(t,e),this.reset())}getSize(t){t.x=this._primaryTarget.width,t.y=this._primaryTarget.height}dispose(){this._primaryTarget.dispose(),this._blendTargets[0].dispose(),this._blendTargets[1].dispose(),this._sobolTarget.dispose(),this._fsQuad.dispose(),this._blendQuad.dispose(),this._task=null}reset(){let{_renderer:t,_primaryTarget:e,_blendTargets:n}=this,i=t.getRenderTarget(),s=t.getClearAlpha();t.getClearColor(Tv),t.setRenderTarget(e),t.setClearColor(0,0),t.clearColor(),t.setRenderTarget(n[0]),t.setClearColor(0,0),t.clearColor(),t.setRenderTarget(n[1]),t.setClearColor(0,0),t.clearColor(),t.setClearColor(Tv,s),t.setRenderTarget(i),this.samples=0,this._task=null,this.material.stratifiedTexture.stableNoise=this.stableNoise,this.stableNoise&&(this.material.seed=0,this.material.stratifiedTexture.reset())}update(){this.material.onBeforeRender(),!this.isCompiling&&(this._task||(this._task=A1.call(this)),this._task.next())}};var Br=new X,wv=new X,ch=new ha,lh=new at,Js=class extends jt{constructor(t=512,e=512){super(new Float32Array(t*e*4),t,e,Lt,Dt,kn,$e,ge,Qt,Qt),this.generationCallback=null}update(){this.dispose(),this.needsUpdate=!0;let{data:t,width:e,height:n}=this.image;for(let i=0;i<e;i++)for(let s=0;s<n;s++){wv.set(e,n),Br.set(i/e,s/n),Br.x-=.5,Br.y=1-Br.y,ch.theta=Br.x*2*Math.PI,ch.phi=Br.y*Math.PI,ch.radius=1,this.generationCallback(ch,Br,wv,lh);let a=4*(s*e+i);t[a+0]=lh.r,t[a+1]=lh.g,t[a+2]=lh.b,t[a+3]=1}}copy(t){return super.copy(t),this.generationCallback=t.generationCallback,this}};var Av=new R,Ks=class extends Js{constructor(t=512){super(t,t),this.topColor=new at().set(16777215),this.bottomColor=new at().set(0),this.exponent=2,this.generationCallback=(e,n,i,s)=>{Av.setFromSpherical(e);let o=Av.y*.5+.5;s.lerpColors(this.bottomColor,this.topColor,o**this.exponent)}}copy(t){return super.copy(t),this.topColor.copy(t.topColor),this.bottomColor.copy(t.bottomColor),this}};var uh=class extends Pe{get map(){return this.uniforms.map.value}set map(t){this.uniforms.map.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}constructor(t){super({uniforms:{map:{value:null},opacity:{value:1}},vertexShader:`
				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D map;
				uniform float opacity;
				varying vec2 vUv;

				vec4 clampedTexelFatch( sampler2D map, ivec2 px, int lod ) {

					vec4 res = texelFetch( map, ivec2( px.x, px.y ), 0 );

					#if defined( TONE_MAPPING )

					res.xyz = toneMapping( res.xyz );

					#endif

			  		return linearToOutputTexel( res );

				}

				void main() {

					vec2 size = vec2( textureSize( map, 0 ) );
					vec2 pxUv = vUv * size;
					vec2 pxCurr = floor( pxUv );
					vec2 pxFrac = fract( pxUv ) - 0.5;
					vec2 pxOffset;
					pxOffset.x = pxFrac.x > 0.0 ? 1.0 : - 1.0;
					pxOffset.y = pxFrac.y > 0.0 ? 1.0 : - 1.0;

					vec2 pxNext = clamp( pxOffset + pxCurr, vec2( 0.0 ), size - 1.0 );
					vec2 alpha = abs( pxFrac );

					vec4 p1 = mix(
						clampedTexelFatch( map, ivec2( pxCurr.x, pxCurr.y ), 0 ),
						clampedTexelFatch( map, ivec2( pxNext.x, pxCurr.y ), 0 ),
						alpha.x
					);

					vec4 p2 = mix(
						clampedTexelFatch( map, ivec2( pxCurr.x, pxNext.y ), 0 ),
						clampedTexelFatch( map, ivec2( pxNext.x, pxNext.y ), 0 ),
						alpha.x
					);

					gl_FragColor = mix( p1, p2, alpha.y );
					gl_FragColor.a *= opacity;
					#include <premultiplied_alpha_fragment>

				}
			`}),this.setValues(t)}};var Lp=class extends Pe{constructor(){super({uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:`
				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`
				#define ENVMAP_TYPE_CUBE_UV

				uniform samplerCube envMap;
				uniform float flipEnvMap;
				varying vec2 vUv;

				#include <common>
				#include <cube_uv_reflection_fragment>

				${Zs}

				void main() {

					vec3 rayDirection = equirectUvToDirection( vUv );
					rayDirection.x *= flipEnvMap;
					gl_FragColor = textureCube( envMap, rayDirection );

				}`}),this.depthWrite=!1,this.depthTest=!1}},Ea=class{constructor(t){this._renderer=t,this._quad=new Ke(new Lp)}generate(t,e=null,n=null){if(!t.isCubeTexture)throw new Error("CubeToEquirectMaterial: Source can only be cube textures.");let i=t.images[0],s=this._renderer,o=this._quad;e===null&&(e=4*i.height),n===null&&(n=2*i.height);let a=new be(e,n,{type:Dt,colorSpace:i.colorSpace}),c=i.height,l=Math.log2(c)-2,h=1/c,f=1/(3*Math.max(Math.pow(2,l),7*16));o.material.defines.CUBEUV_MAX_MIP=`${l}.0`,o.material.defines.CUBEUV_TEXEL_WIDTH=f,o.material.defines.CUBEUV_TEXEL_HEIGHT=h,o.material.uniforms.envMap.value=t,o.material.uniforms.flipEnvMap.value=t.isRenderTargetTexture?1:-1,o.material.needsUpdate=!0;let u=s.getRenderTarget(),d=s.autoClear;s.autoClear=!0,s.setRenderTarget(a),o.render(s),s.setRenderTarget(u),s.autoClear=d;let g=new Uint16Array(e*n*4),x=new Float32Array(e*n*4);s.readRenderTargetPixels(a,0,0,e,n,x),a.dispose();for(let m=0,_=x.length;m<_;m++)g[m]=Oe.toHalfFloat(x[m]);let p=new jt(g,e,n,Lt,me);return p.minFilter=Dd,p.magFilter=Qt,p.wrapS=$e,p.wrapT=$e,p.mapping=kn,p.needsUpdate=!0,p}dispose(){this._quad.dispose()}};function E1(r){return r.extensions.get("EXT_float_blend")}var Qs=new X,hh=class{get multipleImportanceSampling(){return!!this._pathTracer.material.defines.FEATURE_MIS}set multipleImportanceSampling(t){this._pathTracer.material.setDefine("FEATURE_MIS",t?1:0)}get transmissiveBounces(){return this._pathTracer.material.transmissiveBounces}set transmissiveBounces(t){this._pathTracer.material.transmissiveBounces=t}get bounces(){return this._pathTracer.material.bounces}set bounces(t){this._pathTracer.material.bounces=t}get filterGlossyFactor(){return this._pathTracer.material.filterGlossyFactor}set filterGlossyFactor(t){this._pathTracer.material.filterGlossyFactor=t}get samples(){return this._pathTracer.samples}get target(){return this._pathTracer.target}get tiles(){return this._pathTracer.tiles}get stableNoise(){return this._pathTracer.stableNoise}set stableNoise(t){this._pathTracer.stableNoise=t}get isCompiling(){return!!this._pathTracer.isCompiling}constructor(t){this._renderer=t,this._generator=new Hu,this._pathTracer=new Aa(t),this._queueReset=!1,this._clock=new Ss,this._compilePromise=null,this._lowResPathTracer=new Aa(t),this._lowResPathTracer.tiles.set(1,1),this._quad=new Ke(new uh({map:null,transparent:!0,blending:Ne,premultipliedAlpha:t.getContextAttributes().premultipliedAlpha})),this._materials=null,this._previousEnvironment=null,this._previousBackground=null,this._internalBackground=null,this.renderDelay=100,this.minSamples=5,this.fadeDuration=500,this.enablePathTracing=!0,this.pausePathTracing=!1,this.dynamicLowRes=!1,this.lowResScale=.25,this.renderScale=1,this.synchronizeRenderSize=!0,this.rasterizeScene=!0,this.renderToCanvas=!0,this.textureSize=new X(1024,1024),this.rasterizeSceneCallback=(e,n)=>{this._renderer.render(e,n)},this.renderToCanvasCallback=(e,n,i)=>{let s=n.autoClear;n.autoClear=!1,i.render(n),n.autoClear=s},this.setScene(new Ni,new _e)}setBVHWorker(t){this._generator.setBVHWorker(t)}setScene(t,e,n={}){t.updateMatrixWorld(!0),e.updateMatrixWorld();let i=this._generator;if(i.setObjects(t),this._buildAsync)return i.generateAsync(n.onProgress).then(s=>this._updateFromResults(t,e,s));{let s=i.generate();return this._updateFromResults(t,e,s)}}setSceneAsync(...t){this._buildAsync=!0;let e=this.setScene(...t);return this._buildAsync=!1,e}setCamera(t){this.camera=t,this.updateCamera()}updateCamera(){let t=this.camera;t.updateMatrixWorld(),this._pathTracer.setCamera(t),this._lowResPathTracer.setCamera(t),this.reset()}updateMaterials(){let t=this._pathTracer.material,e=this._renderer,n=this._materials,i=this.textureSize,s=Xx(n);t.textures.setTextures(e,s,i.x,i.y),t.materials.updateFrom(n,s),this.reset()}updateLights(){let t=this.scene,e=this._renderer,n=this._pathTracer.material,i=qx(t),s=Wx(i);n.lights.updateFrom(i,s),n.iesProfiles.setTextures(e,s),this.reset()}updateEnvironment(){let t=this.scene,e=this._pathTracer.material;if(this._internalBackground&&(this._internalBackground.dispose(),this._internalBackground=null),e.backgroundBlur=t.backgroundBlurriness,e.backgroundIntensity=t.backgroundIntensity??1,e.backgroundRotation.makeRotationFromEuler(t.backgroundRotation).invert(),t.background===null)e.backgroundMap=null,e.backgroundAlpha=0;else if(t.background.isColor){this._colorBackground=this._colorBackground||new Ks(16);let n=this._colorBackground;n.topColor.equals(t.background)||(n.topColor.set(t.background),n.bottomColor.set(t.background),n.update()),e.backgroundMap=n,e.backgroundAlpha=1}else if(t.background.isCubeTexture){if(t.background!==this._previousBackground){let n=new Ea(this._renderer).generate(t.background);this._internalBackground=n,e.backgroundMap=n,e.backgroundAlpha=1}}else e.backgroundMap=t.background,e.backgroundAlpha=1;if(e.environmentIntensity=t.environmentIntensity??1,e.environmentRotation.makeRotationFromEuler(t.environmentRotation).invert(),this._previousEnvironment!==t.environment)if(t.environment!==null)if(t.environment.isCubeTexture){let n=new Ea(this._renderer).generate(t.environment);e.envMapInfo.updateFrom(n)}else e.envMapInfo.updateFrom(t.environment);else e.environmentIntensity=0;this._previousEnvironment=t.environment,this._previousBackground=t.background,this.reset()}_updateFromResults(t,e,n){let{materials:i,geometry:s,bvh:o,bvhChanged:a}=n;this._materials=i;let l=this._pathTracer.material;return a&&(l.bvh.updateFrom(o),l.attributesArray.updateFrom(s.attributes.normal,s.attributes.tangent,s.attributes.uv,s.attributes.color),l.materialIndexAttribute.updateFrom(s.attributes.materialIndex)),this._previousScene=t,this.scene=t,this.camera=e,this.updateCamera(),this.updateMaterials(),this.updateEnvironment(),this.updateLights(),n}renderSample(){let t=this._lowResPathTracer,e=this._pathTracer,n=this._renderer,i=this._clock,s=this._quad;this._updateScale(),this._queueReset&&(e.reset(),t.reset(),this._queueReset=!1,s.material.opacity=0,i.start());let o=i.getDelta()*1e3,a=i.getElapsedTime()*1e3;if(!this.pausePathTracing&&this.enablePathTracing&&this.renderDelay<=a&&!this.isCompiling&&e.update(),e.alpha=e.material.backgroundAlpha!==1||!E1(n),t.alpha=e.alpha,this.renderToCanvas){let c=this._renderer,l=this.minSamples;if(a>=this.renderDelay&&this.samples>=this.minSamples&&(this.fadeDuration!==0?s.material.opacity=Math.min(s.material.opacity+o/this.fadeDuration,1):s.material.opacity=1),!this.enablePathTracing||this.samples<l||s.material.opacity<1){if(this.dynamicLowRes&&!this.isCompiling){t.samples<1&&(t.material=e.material,t.update());let h=s.material.opacity;s.material.opacity=1-s.material.opacity,s.material.map=t.target.texture,s.render(c),s.material.opacity=h}(!this.dynamicLowRes&&this.rasterizeScene||this.dynamicLowRes&&this.isCompiling)&&this.rasterizeSceneCallback(this.scene,this.camera)}this.enablePathTracing&&s.material.opacity>0&&(s.material.opacity<1&&(s.material.blending=this.dynamicLowRes?wo:On),s.material.map=e.target.texture,this.renderToCanvasCallback(e.target,c,s),s.material.blending=Ne)}}reset(){this._queueReset=!0,this._pathTracer.samples=0}dispose(){this._renderQuad.dispose(),this._renderQuad.material.dispose(),this._pathTracer.dispose()}_updateScale(){if(this.synchronizeRenderSize){this._renderer.getDrawingBufferSize(Qs);let t=Math.floor(this.renderScale*Qs.x),e=Math.floor(this.renderScale*Qs.y);if(this._pathTracer.getSize(Qs),Qs.x!==t||Qs.y!==e){let n=this.lowResScale;this._pathTracer.setSize(t,e),this._lowResPathTracer.setSize(Math.floor(t*n),Math.floor(e*n))}}}};var fh=class extends Li{constructor(){super(),this.isEquirectCamera=!0}};var dh=class extends ys{constructor(...t){super(...t),this.iesMap=null,this.radius=0}copy(t,e){return super.copy(t,e),this.iesMap=t.iesMap,this.radius=t.radius,this}};var ph=class extends Ms{constructor(...t){super(...t),this.isCircular=!1}copy(t,e){return super.copy(t,e),this.isCircular=t.isCircular,this}};var Fp=class extends Pn{constructor(){super({uniforms:{envMap:{value:null},blur:{value:0}},vertexShader:`

				varying vec2 vUv;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
				}

			`,fragmentShader:`

				#include <common>
				#include <cube_uv_reflection_fragment>

				${Zs}

				uniform sampler2D envMap;
				uniform float blur;
				varying vec2 vUv;
				void main() {

					vec3 rayDirection = equirectUvToDirection( vUv );
					gl_FragColor = textureCubeUV( envMap, rayDirection, blur );

				}

			`})}},mh=class{constructor(t){this.renderer=t,this.pmremGenerator=new _r(t),this.copyQuad=new Ke(new Fp),this.renderTarget=new be(1,1,{type:Dt,format:Lt})}dispose(){this.pmremGenerator.dispose(),this.copyQuad.dispose(),this.renderTarget.dispose()}generate(t,e){let{pmremGenerator:n,renderTarget:i,copyQuad:s,renderer:o}=this,a=n.fromEquirectangular(t),{width:c,height:l}=t.image;i.setSize(c,l),s.material.envMap=a.texture,s.material.blur=e;let h=o.getRenderTarget(),f=o.autoClear;o.setRenderTarget(i),o.autoClear=!0,s.render(o),o.setRenderTarget(h),o.autoClear=f;let u=new Uint16Array(c*l*4),d=new Float32Array(c*l*4);o.readRenderTargetPixels(i,0,0,c,l,d);for(let x=0,p=d.length;x<p;x++)u[x]=Oe.toHalfFloat(d[x]);let g=new jt(u,c,l,Lt,me);return g.minFilter=t.minFilter,g.magFilter=t.magFilter,g.wrapS=t.wrapS,g.wrapT=t.wrapT,g.mapping=kn,g.needsUpdate=!0,a.dispose(),g}};var gh=class extends Pn{constructor(t){super({blending:Ne,transparent:!1,depthWrite:!1,depthTest:!1,defines:{USE_SLIDER:0},uniforms:{sigma:{value:5},threshold:{value:.03},kSigma:{value:1},map:{value:null},opacity:{value:1}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}

			`,fragmentShader:`

				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				//  Copyright (c) 2018-2019 Michele Morrone
				//  All rights reserved.
				//
				//  https://michelemorrone.eu - https://BrutPitt.com
				//
				//  me@michelemorrone.eu - brutpitt@gmail.com
				//  twitter: @BrutPitt - github: BrutPitt
				//
				//  https://github.com/BrutPitt/glslSmartDeNoise/
				//
				//  This software is distributed under the terms of the BSD 2-Clause license
				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

				uniform sampler2D map;

				uniform float sigma;
				uniform float threshold;
				uniform float kSigma;
				uniform float opacity;

				varying vec2 vUv;

				#define INV_SQRT_OF_2PI 0.39894228040143267793994605993439
				#define INV_PI 0.31830988618379067153776752674503

				// Parameters:
				//	 sampler2D tex	 - sampler image / texture
				//	 vec2 uv		   - actual fragment coord
				//	 float sigma  >  0 - sigma Standard Deviation
				//	 float kSigma >= 0 - sigma coefficient
				//		 kSigma * sigma  -->  radius of the circular kernel
				//	 float threshold   - edge sharpening threshold
				vec4 smartDeNoise( sampler2D tex, vec2 uv, float sigma, float kSigma, float threshold ) {

					float radius = round( kSigma * sigma );
					float radQ = radius * radius;

					float invSigmaQx2 = 0.5 / ( sigma * sigma );
					float invSigmaQx2PI = INV_PI * invSigmaQx2;

					float invThresholdSqx2 = 0.5 / ( threshold * threshold );
					float invThresholdSqrt2PI = INV_SQRT_OF_2PI / threshold;

					vec4 centrPx = texture2D( tex, uv );
					centrPx.rgb *= centrPx.a;

					float zBuff = 0.0;
					vec4 aBuff = vec4( 0.0 );
					vec2 size = vec2( textureSize( tex, 0 ) );

					vec2 d;
					for ( d.x = - radius; d.x <= radius; d.x ++ ) {

						float pt = sqrt( radQ - d.x * d.x );

						for ( d.y = - pt; d.y <= pt; d.y ++ ) {

							float blurFactor = exp( - dot( d, d ) * invSigmaQx2 ) * invSigmaQx2PI;

							vec4 walkPx = texture2D( tex, uv + d / size );
							walkPx.rgb *= walkPx.a;

							vec4 dC = walkPx - centrPx;
							float deltaFactor = exp( - dot( dC.rgba, dC.rgba ) * invThresholdSqx2 ) * invThresholdSqrt2PI * blurFactor;

							zBuff += deltaFactor;
							aBuff += deltaFactor * walkPx;

						}

					}

					return aBuff / zBuff;

				}

				void main() {

					gl_FragColor = smartDeNoise( map, vec2( vUv.x, vUv.y ), sigma, kSigma, threshold );
					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <premultiplied_alpha_fragment>

					gl_FragColor.a *= opacity;

				}

			`}),this.setValues(t)}};var xh=class extends jn{constructor(t){super(t),this.isFogVolumeMaterial=!0,this.density=.015,this.emissive=new at,this.emissiveIntensity=0,this.opacity=.15,this.transparent=!0,this.roughness=1,this.metalness=0,this.setValues(t)}};var vh=class extends aa{constructor(t){super(t),this.type=me}parse(t){let o=function(A,M){switch(A){case 1:throw new Error("THREE.RGBELoader: Read Error: "+(M||""));case 2:throw new Error("THREE.RGBELoader: Write Error: "+(M||""));case 3:throw new Error("THREE.RGBELoader: Bad File Format: "+(M||""));default:case 4:throw new Error("THREE.RGBELoader: Memory Error: "+(M||""))}},h=`
`,f=function(A,M,b){M=M||1024;let D=A.pos,F=-1,N=0,k="",U=String.fromCharCode.apply(null,new Uint16Array(A.subarray(D,D+128)));for(;0>(F=U.indexOf(h))&&N<M&&D<A.byteLength;)k+=U,N+=U.length,D+=128,U+=String.fromCharCode.apply(null,new Uint16Array(A.subarray(D,D+128)));return-1<F?(b!==!1&&(A.pos+=N+F+1),k+U.slice(0,F)):!1},u=function(A){let M=/^#\?(\S+)/,b=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,I=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,D=/^\s*FORMAT=(\S+)\s*$/,F=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,N={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},k,U;for((A.pos>=A.byteLength||!(k=f(A)))&&o(1,"no header found"),(U=k.match(M))||o(3,"bad initial token"),N.valid|=1,N.programtype=U[1],N.string+=k+`
`;k=f(A),k!==!1;){if(N.string+=k+`
`,k.charAt(0)==="#"){N.comments+=k+`
`;continue}if((U=k.match(b))&&(N.gamma=parseFloat(U[1])),(U=k.match(I))&&(N.exposure=parseFloat(U[1])),(U=k.match(D))&&(N.valid|=2,N.format=U[1]),(U=k.match(F))&&(N.valid|=4,N.height=parseInt(U[1],10),N.width=parseInt(U[2],10)),N.valid&2&&N.valid&4)break}return N.valid&2||o(3,"missing format specifier"),N.valid&4||o(3,"missing image size specifier"),N},d=function(A,M,b){let I=M;if(I<8||I>32767||A[0]!==2||A[1]!==2||A[2]&128)return new Uint8Array(A);I!==(A[2]<<8|A[3])&&o(3,"wrong scanline width");let D=new Uint8Array(4*M*b);D.length||o(4,"unable to allocate buffer space");let F=0,N=0,k=4*I,U=new Uint8Array(4),$=new Uint8Array(k),W=b;for(;W>0&&N<A.byteLength;){N+4>A.byteLength&&o(1),U[0]=A[N++],U[1]=A[N++],U[2]=A[N++],U[3]=A[N++],(U[0]!=2||U[1]!=2||(U[2]<<8|U[3])!=I)&&o(3,"bad rgbe scanline format");let st=0,lt;for(;st<k&&N<A.byteLength;){lt=A[N++];let Pt=lt>128;if(Pt&&(lt-=128),(lt===0||st+lt>k)&&o(3,"bad scanline data"),Pt){let qt=A[N++];for(let q=0;q<lt;q++)$[st++]=qt}else $.set(A.subarray(N,N+lt),st),st+=lt,N+=lt}let gt=I;for(let Pt=0;Pt<gt;Pt++){let qt=0;D[F]=$[Pt+qt],qt+=I,D[F+1]=$[Pt+qt],qt+=I,D[F+2]=$[Pt+qt],qt+=I,D[F+3]=$[Pt+qt],F+=4}W--}return D},g=function(A,M,b,I){let D=A[M+3],F=Math.pow(2,D-128)/255;b[I+0]=A[M+0]*F,b[I+1]=A[M+1]*F,b[I+2]=A[M+2]*F,b[I+3]=1},x=function(A,M,b,I){let D=A[M+3],F=Math.pow(2,D-128)/255;b[I+0]=Oe.toHalfFloat(Math.min(A[M+0]*F,65504)),b[I+1]=Oe.toHalfFloat(Math.min(A[M+1]*F,65504)),b[I+2]=Oe.toHalfFloat(Math.min(A[M+2]*F,65504)),b[I+3]=Oe.toHalfFloat(1)},p=new Uint8Array(t);p.pos=0;let m=u(p),_=m.width,v=m.height,y=d(p.subarray(p.pos),_,v),w,S,T;switch(this.type){case Dt:T=y.length/4;let A=new Float32Array(T*4);for(let b=0;b<T;b++)g(y,b*4,A,b*4);w=A,S=Dt;break;case me:T=y.length/4;let M=new Uint16Array(T*4);for(let b=0;b<T;b++)x(y,b*4,M,b*4);w=M,S=me;break;default:throw new Error("THREE.RGBELoader: Unsupported type: "+this.type)}return{width:_,height:v,data:w,header:m.string,gamma:m.gamma,exposure:m.exposure,type:S}}setDataType(t){return this.type=t,this}load(t,e,n,i){function s(o,a){switch(o.type){case Dt:case me:o.colorSpace=Wn,o.minFilter=Qt,o.magFilter=Qt,o.generateMipmaps=!1,o.flipY=!0;break}e&&e(o,a)}return super.load(t,s,n,i)}};var _h=class extends Ni{constructor(t=null){super();let e=new pi;e.deleteAttribute("uv");let n=new jn({side:Ie}),i=new jn,s=new bs(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let o=new Zt(e,n);o.position.set(-.757,13.219,.717),o.scale.set(31.713,28.305,28.591),this.add(o);let a=new Zt(e,i);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);let c=new Zt(e,i);c.position.set(-5.607,-.754,-.758),c.rotation.set(0,.994,0),c.scale.set(1.97,1.534,3.955),this.add(c);let l=new Zt(e,i);l.position.set(6.167,.857,7.803),l.rotation.set(0,.561,0),l.scale.set(3.927,6.285,3.687),this.add(l);let h=new Zt(e,i);h.position.set(-2.017,.018,6.124),h.rotation.set(0,.333,0),h.scale.set(2.002,4.566,2.064),this.add(h);let f=new Zt(e,i);f.position.set(2.291,-.756,-2.621),f.rotation.set(0,-.286,0),f.scale.set(1.546,1.552,1.496),this.add(f);let u=new Zt(e,i);u.position.set(-2.193,-.369,-5.547),u.rotation.set(0,.516,0),u.scale.set(3.875,3.487,2.986),this.add(u);let d=new Zt(e,js(50));d.position.set(-16.116,14.37,8.208),d.scale.set(.1,2.428,2.739),this.add(d);let g=new Zt(e,js(50));g.position.set(-16.109,18.021,-8.207),g.scale.set(.1,2.425,2.751),this.add(g);let x=new Zt(e,js(17));x.position.set(14.904,12.198,-1.832),x.scale.set(.15,4.265,6.331),this.add(x);let p=new Zt(e,js(43));p.position.set(-.462,8.89,14.52),p.scale.set(4.38,5.441,.088),this.add(p);let m=new Zt(e,js(20));m.position.set(3.235,11.486,-12.541),m.scale.set(2.5,2,.1),this.add(m);let _=new Zt(e,js(100));_.position.set(0,20,0),_.scale.set(1,.1,1),this.add(_)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function js(r){let t=new mn;return t.color.setScalar(r),t}window.PT={THREE:$d,REVISION:Ts,MeshBVH:Pr,SAH:2,CENTER:0,AVERAGE:1,WebGLPathTracer:hh,PhysicalCamera:qs,EquirectCamera:fh,DenoiseMaterial:gh,BlurredEnvMapGenerator:mh,GradientEquirectTexture:Ks,ProceduralEquirectTexture:Js,ShapedAreaLight:ph,PhysicalSpotLight:dh,FogVolumeMaterial:xh,FullScreenQuad:Ke,RoomEnvironment:_h,RGBELoader:vh,versions:{three:"0.166.1","three-mesh-bvh":"0.7.8","three-gpu-pathtracer":"0.0.23"}};})();
