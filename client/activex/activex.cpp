// activex.cpp : CactivexApp 和 DLL 注册的实现。

#include "stdafx.h"
#include "activex.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


CactivexApp theApp;

const GUID CDECL _tlid = { 0x22DAEA2D, 0xF3A3, 0x4AC1, { 0xBA, 0xDB, 0xDF, 0x5E, 0xE7, 0xB9, 0x2E, 0xE0 } };
const WORD _wVerMajor = 1;
const WORD _wVerMinor = 0;



// CactivexApp::InitInstance - DLL 初始化

BOOL CactivexApp::InitInstance()
{
	BOOL bInit = COleControlModule::InitInstance();

	if (bInit)
	{
		// TODO: 在此添加您自己的模块初始化代码。
	}

	return bInit;
}



// CactivexApp::ExitInstance - DLL 终止

int CactivexApp::ExitInstance()
{
	// TODO: 在此添加您自己的模块终止代码。

	return COleControlModule::ExitInstance();
}



// DllRegisterServer - 将项添加到系统注册表

STDAPI DllRegisterServer(void)
{
	AFX_MANAGE_STATE(_afxModuleAddrThis);

	if (!AfxOleRegisterTypeLib(AfxGetInstanceHandle(), _tlid))
		return ResultFromScode(SELFREG_E_TYPELIB);

	if (!COleObjectFactoryEx::UpdateRegistryAll(TRUE))
		return ResultFromScode(SELFREG_E_CLASS);

	return NOERROR;
}



// DllUnregisterServer - 将项从系统注册表中移除

STDAPI DllUnregisterServer(void)
{
	AFX_MANAGE_STATE(_afxModuleAddrThis);

	if (!AfxOleUnregisterTypeLib(_tlid, _wVerMajor, _wVerMinor))
		return ResultFromScode(SELFREG_E_TYPELIB);

	if (!COleObjectFactoryEx::UpdateRegistryAll(FALSE))
		return ResultFromScode(SELFREG_E_CLASS);

	return NOERROR;
}
