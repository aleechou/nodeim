

/* this ALWAYS GENERATED file contains the IIDs and CLSIDs */

/* link this file in with the server and any clients */


 /* File created by MIDL compiler version 7.00.0555 */
/* at Thu Jun 13 15:32:07 2013
 */
/* Compiler settings for activex.idl:
    Oicf, W1, Zp8, env=Win32 (32b run), target_arch=X86 7.00.0555 
    protocol : dce , ms_ext, c_ext, robust
    error checks: allocation ref bounds_check enum stub_data 
    VC __declspec() decoration level: 
         __declspec(uuid()), __declspec(selectany), __declspec(novtable)
         DECLSPEC_UUID(), MIDL_INTERFACE()
*/
/* @@MIDL_FILE_HEADING(  ) */

#pragma warning( disable: 4049 )  /* more than 64k source lines */


#ifdef __cplusplus
extern "C"{
#endif 


#include <rpc.h>
#include <rpcndr.h>

#ifdef _MIDL_USE_GUIDDEF_

#ifndef INITGUID
#define INITGUID
#include <guiddef.h>
#undef INITGUID
#else
#include <guiddef.h>
#endif

#define MIDL_DEFINE_GUID(type,name,l,w1,w2,b1,b2,b3,b4,b5,b6,b7,b8) \
        DEFINE_GUID(name,l,w1,w2,b1,b2,b3,b4,b5,b6,b7,b8)

#else // !_MIDL_USE_GUIDDEF_

#ifndef __IID_DEFINED__
#define __IID_DEFINED__

typedef struct _IID
{
    unsigned long x;
    unsigned short s1;
    unsigned short s2;
    unsigned char  c[8];
} IID;

#endif // __IID_DEFINED__

#ifndef CLSID_DEFINED
#define CLSID_DEFINED
typedef IID CLSID;
#endif // CLSID_DEFINED

#define MIDL_DEFINE_GUID(type,name,l,w1,w2,b1,b2,b3,b4,b5,b6,b7,b8) \
        const type name = {l,w1,w2,{b1,b2,b3,b4,b5,b6,b7,b8}}

#endif !_MIDL_USE_GUIDDEF_

MIDL_DEFINE_GUID(IID, LIBID_activexLib,0x22DAEA2D,0xF3A3,0x4AC1,0xBA,0xDB,0xDF,0x5E,0xE7,0xB9,0x2E,0xE0);


MIDL_DEFINE_GUID(IID, DIID__Dactivex,0xC29290A6,0x491A,0x4F9F,0x9E,0x8F,0x45,0xBC,0xD3,0xC1,0x48,0xF3);


MIDL_DEFINE_GUID(IID, DIID__DactivexEvents,0x9B2B85E5,0x113C,0x43A6,0xA9,0xA5,0xB7,0x55,0x06,0xEC,0x13,0xFD);


MIDL_DEFINE_GUID(CLSID, CLSID_activex,0xDC8D3D65,0x84F4,0x46ED,0xB3,0x80,0xC6,0x87,0xCC,0xC9,0x7F,0x34);

#undef MIDL_DEFINE_GUID

#ifdef __cplusplus
}
#endif



