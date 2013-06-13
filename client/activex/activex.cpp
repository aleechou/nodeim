// activex.cpp : CactivexApp �� DLL ע���ʵ�֡�

#include "stdafx.h"
#include "activex.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


CactivexApp theApp;

const GUID CDECL _tlid = { 0x22DAEA2D, 0xF3A3, 0x4AC1, { 0xBA, 0xDB, 0xDF, 0x5E, 0xE7, 0xB9, 0x2E, 0xE0 } };
const WORD _wVerMajor = 1;
const WORD _wVerMinor = 0;



// CactivexApp::InitInstance - DLL ��ʼ��

BOOL CactivexApp::InitInstance()
{
	BOOL bInit = COleControlModule::InitInstance();

	if (bInit)
	{
		// TODO: �ڴ�������Լ���ģ���ʼ�����롣
	}

	return bInit;
}



// CactivexApp::ExitInstance - DLL ��ֹ

int CactivexApp::ExitInstance()
{
	// TODO: �ڴ�������Լ���ģ����ֹ���롣

	return COleControlModule::ExitInstance();
}



// DllRegisterServer - ������ӵ�ϵͳע���

STDAPI DllRegisterServer(void)
{
	AFX_MANAGE_STATE(_afxModuleAddrThis);

	if (!AfxOleRegisterTypeLib(AfxGetInstanceHandle(), _tlid))
		return ResultFromScode(SELFREG_E_TYPELIB);

	if (!COleObjectFactoryEx::UpdateRegistryAll(TRUE))
		return ResultFromScode(SELFREG_E_CLASS);

	return NOERROR;
}



// DllUnregisterServer - �����ϵͳע������Ƴ�

STDAPI DllUnregisterServer(void)
{
	AFX_MANAGE_STATE(_afxModuleAddrThis);

	if (!AfxOleUnregisterTypeLib(_tlid, _wVerMajor, _wVerMinor))
		return ResultFromScode(SELFREG_E_TYPELIB);

	if (!COleObjectFactoryEx::UpdateRegistryAll(FALSE))
		return ResultFromScode(SELFREG_E_CLASS);

	return NOERROR;
}
