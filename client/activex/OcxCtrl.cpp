// OcxCtrl.cpp : COcxCtrl ActiveX �ؼ����ʵ�֡�

#include "stdafx.h"
#include "activex.h"
#include "OcxCtrl.h"
#include "OcxPpg.h"
#include "afxdialogex.h"


#ifdef _DEBUG
#define new DEBUG_NEW
#endif


IMPLEMENT_DYNCREATE(COcxCtrl, COleControl)



// ��Ϣӳ��

BEGIN_MESSAGE_MAP(COcxCtrl, COleControl)
	ON_OLEVERB(AFX_IDS_VERB_PROPERTIES, OnProperties)
END_MESSAGE_MAP()



// ����ӳ��

BEGIN_DISPATCH_MAP(COcxCtrl, COleControl)
	DISP_FUNCTION_ID(COcxCtrl, "AboutBox", DISPID_ABOUTBOX, AboutBox, VT_EMPTY, VTS_NONE)
END_DISPATCH_MAP()



// �¼�ӳ��

BEGIN_EVENT_MAP(COcxCtrl, COleControl)
END_EVENT_MAP()



// ����ҳ

// TODO: ����Ҫ��Ӹ�������ҳ�����ס���Ӽ���!
BEGIN_PROPPAGEIDS(COcxCtrl, 1)
	PROPPAGEID(COcxPropPage::guid)
END_PROPPAGEIDS(COcxCtrl)



// ��ʼ���๤���� guid

IMPLEMENT_OLECREATE_EX(COcxCtrl, "nodeim.ocx",
	0xdc8d3d65, 0x84f4, 0x46ed, 0xb3, 0x80, 0xc6, 0x87, 0xcc, 0xc9, 0x7f, 0x34)



// ����� ID �Ͱ汾

IMPLEMENT_OLETYPELIB(COcxCtrl, _tlid, _wVerMajor, _wVerMinor)



// �ӿ� ID

const IID IID_Dactivex = { 0xC29290A6, 0x491A, 0x4F9F, { 0x9E, 0x8F, 0x45, 0xBC, 0xD3, 0xC1, 0x48, 0xF3 } };
const IID IID_DactivexEvents = { 0x9B2B85E5, 0x113C, 0x43A6, { 0xA9, 0xA5, 0xB7, 0x55, 0x6, 0xEC, 0x13, 0xFD } };


// �ؼ�������Ϣ

static const DWORD _dwactivexOleMisc =
	OLEMISC_ACTIVATEWHENVISIBLE |
	OLEMISC_SETCLIENTSITEFIRST |
	OLEMISC_INSIDEOUT |
	OLEMISC_CANTLINKINSIDE |
	OLEMISC_RECOMPOSEONRESIZE;

IMPLEMENT_OLECTLTYPE(COcxCtrl, IDS_ACTIVEX, _dwactivexOleMisc)



// COcxCtrl::COcxCtrlFactory::UpdateRegistry -
// ��ӻ��Ƴ� COcxCtrl ��ϵͳע�����
/*
BOOL COcxCtrl::COcxCtrlFactory::UpdateRegistry(BOOL bRegister)
{
	// TODO: ��֤���Ŀؼ��Ƿ���ϵ�Ԫģ���̴߳������
	// �йظ�����Ϣ����ο� MFC ����˵�� 64��
	// ������Ŀؼ������ϵ�Ԫģ�͹�����
	// �����޸����´��룬��������������
	// afxRegApartmentThreading ��Ϊ 0��

	if (bRegister)
		return AfxOleRegisterControlClass(
			AfxGetInstanceHandle(),
			m_clsid,
			m_lpszProgID,
			IDS_ACTIVEX,
			IDB_ACTIVEX,
			afxRegApartmentThreading,
			_dwactivexOleMisc,
			_tlid,
			_wVerMajor,
			_wVerMinor);
	else
		return AfxOleUnregisterClass(m_clsid, m_lpszProgID);
}
*/



/////////////////////////////////////////////////////////////////////////////
// Interface map for IObjectSafety
BEGIN_INTERFACE_MAP( COcxCtrl, COleControl )
 INTERFACE_PART(COcxCtrl, IID_IObjectSafety, ObjSafe)
END_INTERFACE_MAP()
/////////////////////////////////////////////////////////////////////////////
// IObjectSafety member functions
// Delegate AddRef, Release, QueryInterface
ULONG FAR EXPORT COcxCtrl::XObjSafe::AddRef()
{
   METHOD_PROLOGUE(COcxCtrl, ObjSafe)
   return pThis->ExternalAddRef();
}
ULONG FAR EXPORT COcxCtrl::XObjSafe::Release()
{
   METHOD_PROLOGUE(COcxCtrl, ObjSafe)
   return pThis->ExternalRelease();
}
HRESULT FAR EXPORT COcxCtrl::XObjSafe::QueryInterface(
   REFIID iid, void FAR* FAR* ppvObj)
{
   METHOD_PROLOGUE(COcxCtrl, ObjSafe)
   return (HRESULT)pThis->ExternalQueryInterface(&iid, ppvObj);
}
const DWORD dwSupportedBits =
 INTERFACESAFE_FOR_UNTRUSTED_CALLER |
 INTERFACESAFE_FOR_UNTRUSTED_DATA;
const DWORD dwNotSupportedBits = ~ dwSupportedBits;
 
/////////////////////////////////////////////////////////////////////////////
// CStopLiteCtrl::XObjSafe::GetInterfaceSafetyOptions
// Allows container to query what interfaces are safe for what. We're
// optimizing significantly by ignoring which interface the caller is
// asking for.
HRESULT STDMETHODCALLTYPE
 COcxCtrl::XObjSafe::GetInterfaceSafetyOptions(
 REFIID riid,
       DWORD __RPC_FAR *pdwSupportedOptions,
       DWORD __RPC_FAR *pdwEnabledOptions)
{
 METHOD_PROLOGUE(COcxCtrl, ObjSafe)
 HRESULT retval = ResultFromScode(S_OK);
 // does interface exist?
 IUnknown FAR* punkInterface;
 retval = pThis->ExternalQueryInterface(&riid,
    (void * *)&punkInterface);
 if (retval != E_NOINTERFACE) { // interface exists
 punkInterface->Release(); // release it--just checking!
 }
 
 // we support both kinds of safety and have always both set,
 // regardless of interface
 *pdwSupportedOptions = *pdwEnabledOptions = dwSupportedBits;
 return retval; // E_NOINTERFACE if QI failed
}
/////////////////////////////////////////////////////////////////////////////
// CStopLiteCtrl::XObjSafe::SetInterfaceSafetyOptions
// Since we're always safe, this is a no-brainer--but we do check to make
// sure the interface requested exists and that the options we're asked to
// set exist and are set on (we don't support unsafe mode).
HRESULT STDMETHODCALLTYPE
 COcxCtrl::XObjSafe::SetInterfaceSafetyOptions(
       REFIID riid,
       DWORD dwOptionSetMask,
       DWORD dwEnabledOptions)
{
   METHOD_PROLOGUE(COcxCtrl, ObjSafe)
 
 // does interface exist?
 IUnknown FAR* punkInterface;
 pThis->ExternalQueryInterface(&riid, (void * *)&punkInterface);
 if (punkInterface) { // interface exists
 punkInterface->Release(); // release it--just checking!
 }
 else { // interface doesn't exist
 return ResultFromScode(E_NOINTERFACE);
 }
 // can't set bits we don't support
 if (dwOptionSetMask & dwNotSupportedBits) {
 return ResultFromScode(E_FAIL);
 }
 
 // can't set bits we do support to zero
 dwEnabledOptions &= dwSupportedBits;
 // (we already know there are no extra bits in mask )
 if ((dwOptionSetMask & dwEnabledOptions) !=
  dwOptionSetMask) {
 return ResultFromScode(E_FAIL);
 }       
 
 // don't need to change anything since we're always safe
 return ResultFromScode(S_OK);
}
/////////////////////////////////////////////////////////////////////////////
// COcxCtrl::COcxCtrlFactory::UpdateRegistry -
// Adds or removes system registry entries for COcxCtrl
BOOL COcxCtrl::COcxCtrlFactory::UpdateRegistry(BOOL bRegister)
{
 // TODO: Verify that your control follows apartment-model threading rules.
 // Refer to MFC TechNote 64 for more information.
 // If your control does not conform to the apartment-model rules, then
 // you must modify the code below, changing the 6th parameter from
 // afxRegApartmentThreadingto 0.
 if (bRegister)
 return AfxOleRegisterControlClass(
  AfxGetInstanceHandle(),
  m_clsid,
  m_lpszProgID,
  IDS_ACTIVEX, //�����COcxCtrlΪ��д
  IDB_ACTIVEX, //�����COcxCtrlΪ��д
  afxRegApartmentThreading,
  _dwactivexOleMisc,
  _tlid,
  _wVerMajor,
  _wVerMinor);
 else
 return AfxOleUnregisterClass(m_clsid, m_lpszProgID);
}


// COcxCtrl::COcxCtrl - ���캯��

COcxCtrl::COcxCtrl()
{
	InitializeIIDs(&IID_Dactivex, &IID_DactivexEvents);
	// TODO: �ڴ˳�ʼ���ؼ���ʵ�����ݡ�
}



// COcxCtrl::~COcxCtrl - ��������

COcxCtrl::~COcxCtrl()
{
	// TODO: �ڴ�����ؼ���ʵ�����ݡ�
}



// COcxCtrl::OnDraw - ��ͼ����

void COcxCtrl::OnDraw(
			CDC* pdc, const CRect& rcBounds, const CRect& rcInvalid)
{
	if (!pdc)
		return;

	// TODO: �����Լ��Ļ�ͼ�����滻����Ĵ��롣
	pdc->FillRect(rcBounds, CBrush::FromHandle((HBRUSH)GetStockObject(WHITE_BRUSH)));
	pdc->Ellipse(rcBounds);

	if (!IsOptimizedDraw())
	{
		// ������֧���Ż���ͼ��

		// TODO: ������κ� GDI ����ѡ�뵽�豸������ *pdc �У�
		//		���ڴ˴��ָ���ǰѡ���Ķ���
	}
}



// COcxCtrl::DoPropExchange - �־���֧��

void COcxCtrl::DoPropExchange(CPropExchange* pPX)
{
	ExchangeVersion(pPX, MAKELONG(_wVerMinor, _wVerMajor));
	COleControl::DoPropExchange(pPX);

	// TODO: Ϊÿ���־õ��Զ������Ե��� PX_ ������
}



// COcxCtrl::GetControlFlags -
// �Զ��� MFC �� ActiveX �ؼ�ʵ�ֵı�־��
//
DWORD COcxCtrl::GetControlFlags()
{
	DWORD dwFlags = COleControl::GetControlFlags();


	// �ؼ�ͨ������ԭ�豸�������е�
	// ԭʼ GDI ���󣬿����Ż����� OnDraw ������
	dwFlags |= canOptimizeDraw;
	return dwFlags;
}



// COcxCtrl::OnResetState - ���ؼ�����ΪĬ��״̬

void COcxCtrl::OnResetState()
{
	COleControl::OnResetState();  // ���� DoPropExchange ���ҵ���Ĭ��ֵ

	// TODO: �ڴ��������������ؼ�״̬��
}



// COcxCtrl::AboutBox - ���û���ʾ�����ڡ���

void COcxCtrl::AboutBox()
{
	CDialogEx dlgAbout(IDD_ABOUTBOX_ACTIVEX);
	dlgAbout.DoModal();
}



// COcxCtrl ��Ϣ�������
