

/* this ALWAYS GENERATED file contains the definitions for the interfaces */


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


/* verify that the <rpcndr.h> version is high enough to compile this file*/
#ifndef __REQUIRED_RPCNDR_H_VERSION__
#define __REQUIRED_RPCNDR_H_VERSION__ 475
#endif

#include "rpc.h"
#include "rpcndr.h"

#ifndef __RPCNDR_H_VERSION__
#error this stub requires an updated version of <rpcndr.h>
#endif // __RPCNDR_H_VERSION__


#ifndef __activexidl_h__
#define __activexidl_h__

#if defined(_MSC_VER) && (_MSC_VER >= 1020)
#pragma once
#endif

/* Forward Declarations */ 

#ifndef ___Dactivex_FWD_DEFINED__
#define ___Dactivex_FWD_DEFINED__
typedef interface _Dactivex _Dactivex;
#endif 	/* ___Dactivex_FWD_DEFINED__ */


#ifndef ___DactivexEvents_FWD_DEFINED__
#define ___DactivexEvents_FWD_DEFINED__
typedef interface _DactivexEvents _DactivexEvents;
#endif 	/* ___DactivexEvents_FWD_DEFINED__ */


#ifndef __activex_FWD_DEFINED__
#define __activex_FWD_DEFINED__

#ifdef __cplusplus
typedef class activex activex;
#else
typedef struct activex activex;
#endif /* __cplusplus */

#endif 	/* __activex_FWD_DEFINED__ */


#ifdef __cplusplus
extern "C"{
#endif 



#ifndef __activexLib_LIBRARY_DEFINED__
#define __activexLib_LIBRARY_DEFINED__

/* library activexLib */
/* [control][version][uuid] */ 


EXTERN_C const IID LIBID_activexLib;

#ifndef ___Dactivex_DISPINTERFACE_DEFINED__
#define ___Dactivex_DISPINTERFACE_DEFINED__

/* dispinterface _Dactivex */
/* [uuid] */ 


EXTERN_C const IID DIID__Dactivex;

#if defined(__cplusplus) && !defined(CINTERFACE)

    MIDL_INTERFACE("C29290A6-491A-4F9F-9E8F-45BCD3C148F3")
    _Dactivex : public IDispatch
    {
    };
    
#else 	/* C style interface */

    typedef struct _DactivexVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            _Dactivex * This,
            /* [in] */ REFIID riid,
            /* [annotation][iid_is][out] */ 
            __RPC__deref_out  void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            _Dactivex * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            _Dactivex * This);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfoCount )( 
            _Dactivex * This,
            /* [out] */ UINT *pctinfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfo )( 
            _Dactivex * This,
            /* [in] */ UINT iTInfo,
            /* [in] */ LCID lcid,
            /* [out] */ ITypeInfo **ppTInfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetIDsOfNames )( 
            _Dactivex * This,
            /* [in] */ REFIID riid,
            /* [size_is][in] */ LPOLESTR *rgszNames,
            /* [range][in] */ UINT cNames,
            /* [in] */ LCID lcid,
            /* [size_is][out] */ DISPID *rgDispId);
        
        /* [local] */ HRESULT ( STDMETHODCALLTYPE *Invoke )( 
            _Dactivex * This,
            /* [in] */ DISPID dispIdMember,
            /* [in] */ REFIID riid,
            /* [in] */ LCID lcid,
            /* [in] */ WORD wFlags,
            /* [out][in] */ DISPPARAMS *pDispParams,
            /* [out] */ VARIANT *pVarResult,
            /* [out] */ EXCEPINFO *pExcepInfo,
            /* [out] */ UINT *puArgErr);
        
        END_INTERFACE
    } _DactivexVtbl;

    interface _Dactivex
    {
        CONST_VTBL struct _DactivexVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define _Dactivex_QueryInterface(This,riid,ppvObject)	\
    ( (This)->lpVtbl -> QueryInterface(This,riid,ppvObject) ) 

#define _Dactivex_AddRef(This)	\
    ( (This)->lpVtbl -> AddRef(This) ) 

#define _Dactivex_Release(This)	\
    ( (This)->lpVtbl -> Release(This) ) 


#define _Dactivex_GetTypeInfoCount(This,pctinfo)	\
    ( (This)->lpVtbl -> GetTypeInfoCount(This,pctinfo) ) 

#define _Dactivex_GetTypeInfo(This,iTInfo,lcid,ppTInfo)	\
    ( (This)->lpVtbl -> GetTypeInfo(This,iTInfo,lcid,ppTInfo) ) 

#define _Dactivex_GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)	\
    ( (This)->lpVtbl -> GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId) ) 

#define _Dactivex_Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)	\
    ( (This)->lpVtbl -> Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr) ) 

#endif /* COBJMACROS */


#endif 	/* C style interface */


#endif 	/* ___Dactivex_DISPINTERFACE_DEFINED__ */


#ifndef ___DactivexEvents_DISPINTERFACE_DEFINED__
#define ___DactivexEvents_DISPINTERFACE_DEFINED__

/* dispinterface _DactivexEvents */
/* [uuid] */ 


EXTERN_C const IID DIID__DactivexEvents;

#if defined(__cplusplus) && !defined(CINTERFACE)

    MIDL_INTERFACE("9B2B85E5-113C-43A6-A9A5-B75506EC13FD")
    _DactivexEvents : public IDispatch
    {
    };
    
#else 	/* C style interface */

    typedef struct _DactivexEventsVtbl
    {
        BEGIN_INTERFACE
        
        HRESULT ( STDMETHODCALLTYPE *QueryInterface )( 
            _DactivexEvents * This,
            /* [in] */ REFIID riid,
            /* [annotation][iid_is][out] */ 
            __RPC__deref_out  void **ppvObject);
        
        ULONG ( STDMETHODCALLTYPE *AddRef )( 
            _DactivexEvents * This);
        
        ULONG ( STDMETHODCALLTYPE *Release )( 
            _DactivexEvents * This);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfoCount )( 
            _DactivexEvents * This,
            /* [out] */ UINT *pctinfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetTypeInfo )( 
            _DactivexEvents * This,
            /* [in] */ UINT iTInfo,
            /* [in] */ LCID lcid,
            /* [out] */ ITypeInfo **ppTInfo);
        
        HRESULT ( STDMETHODCALLTYPE *GetIDsOfNames )( 
            _DactivexEvents * This,
            /* [in] */ REFIID riid,
            /* [size_is][in] */ LPOLESTR *rgszNames,
            /* [range][in] */ UINT cNames,
            /* [in] */ LCID lcid,
            /* [size_is][out] */ DISPID *rgDispId);
        
        /* [local] */ HRESULT ( STDMETHODCALLTYPE *Invoke )( 
            _DactivexEvents * This,
            /* [in] */ DISPID dispIdMember,
            /* [in] */ REFIID riid,
            /* [in] */ LCID lcid,
            /* [in] */ WORD wFlags,
            /* [out][in] */ DISPPARAMS *pDispParams,
            /* [out] */ VARIANT *pVarResult,
            /* [out] */ EXCEPINFO *pExcepInfo,
            /* [out] */ UINT *puArgErr);
        
        END_INTERFACE
    } _DactivexEventsVtbl;

    interface _DactivexEvents
    {
        CONST_VTBL struct _DactivexEventsVtbl *lpVtbl;
    };

    

#ifdef COBJMACROS


#define _DactivexEvents_QueryInterface(This,riid,ppvObject)	\
    ( (This)->lpVtbl -> QueryInterface(This,riid,ppvObject) ) 

#define _DactivexEvents_AddRef(This)	\
    ( (This)->lpVtbl -> AddRef(This) ) 

#define _DactivexEvents_Release(This)	\
    ( (This)->lpVtbl -> Release(This) ) 


#define _DactivexEvents_GetTypeInfoCount(This,pctinfo)	\
    ( (This)->lpVtbl -> GetTypeInfoCount(This,pctinfo) ) 

#define _DactivexEvents_GetTypeInfo(This,iTInfo,lcid,ppTInfo)	\
    ( (This)->lpVtbl -> GetTypeInfo(This,iTInfo,lcid,ppTInfo) ) 

#define _DactivexEvents_GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId)	\
    ( (This)->lpVtbl -> GetIDsOfNames(This,riid,rgszNames,cNames,lcid,rgDispId) ) 

#define _DactivexEvents_Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr)	\
    ( (This)->lpVtbl -> Invoke(This,dispIdMember,riid,lcid,wFlags,pDispParams,pVarResult,pExcepInfo,puArgErr) ) 

#endif /* COBJMACROS */


#endif 	/* C style interface */


#endif 	/* ___DactivexEvents_DISPINTERFACE_DEFINED__ */


EXTERN_C const CLSID CLSID_activex;

#ifdef __cplusplus

class DECLSPEC_UUID("DC8D3D65-84F4-46ED-B380-C687CCC97F34")
activex;
#endif
#endif /* __activexLib_LIBRARY_DEFINED__ */

/* Additional Prototypes for ALL interfaces */

/* end of Additional Prototypes */

#ifdef __cplusplus
}
#endif

#endif


