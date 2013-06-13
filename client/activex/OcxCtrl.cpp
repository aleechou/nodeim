// OcxCtrl.cpp : COcxCtrl ActiveX 控件类的实现。

#include "stdafx.h"
#include "activex.h"
#include "OcxCtrl.h"
#include "OcxPpg.h"
#include "afxdialogex.h"


#ifdef _DEBUG
#define new DEBUG_NEW
#endif


IMPLEMENT_DYNCREATE(COcxCtrl, COleControl)



// 消息映射

BEGIN_MESSAGE_MAP(COcxCtrl, COleControl)
	ON_OLEVERB(AFX_IDS_VERB_PROPERTIES, OnProperties)
END_MESSAGE_MAP()



// 调度映射

BEGIN_DISPATCH_MAP(COcxCtrl, COleControl)
	DISP_FUNCTION_ID(COcxCtrl, "AboutBox", DISPID_ABOUTBOX, AboutBox, VT_EMPTY, VTS_NONE)
END_DISPATCH_MAP()



// 事件映射

BEGIN_EVENT_MAP(COcxCtrl, COleControl)
END_EVENT_MAP()



// 属性页

// TODO: 按需要添加更多属性页。请记住增加计数!
BEGIN_PROPPAGEIDS(COcxCtrl, 1)
	PROPPAGEID(COcxPropPage::guid)
END_PROPPAGEIDS(COcxCtrl)



// 初始化类工厂和 guid

IMPLEMENT_OLECREATE_EX(COcxCtrl, "nodeim.ocx",
	0xdc8d3d65, 0x84f4, 0x46ed, 0xb3, 0x80, 0xc6, 0x87, 0xcc, 0xc9, 0x7f, 0x34)



// 键入库 ID 和版本

IMPLEMENT_OLETYPELIB(COcxCtrl, _tlid, _wVerMajor, _wVerMinor)



// 接口 ID

const IID IID_Dactivex = { 0xC29290A6, 0x491A, 0x4F9F, { 0x9E, 0x8F, 0x45, 0xBC, 0xD3, 0xC1, 0x48, 0xF3 } };
const IID IID_DactivexEvents = { 0x9B2B85E5, 0x113C, 0x43A6, { 0xA9, 0xA5, 0xB7, 0x55, 0x6, 0xEC, 0x13, 0xFD } };


// 控件类型信息

static const DWORD _dwactivexOleMisc =
	OLEMISC_ACTIVATEWHENVISIBLE |
	OLEMISC_SETCLIENTSITEFIRST |
	OLEMISC_INSIDEOUT |
	OLEMISC_CANTLINKINSIDE |
	OLEMISC_RECOMPOSEONRESIZE;

IMPLEMENT_OLECTLTYPE(COcxCtrl, IDS_ACTIVEX, _dwactivexOleMisc)



// COcxCtrl::COcxCtrlFactory::UpdateRegistry -
// 添加或移除 COcxCtrl 的系统注册表项
/*
BOOL COcxCtrl::COcxCtrlFactory::UpdateRegistry(BOOL bRegister)
{
	// TODO: 验证您的控件是否符合单元模型线程处理规则。
	// 有关更多信息，请参考 MFC 技术说明 64。
	// 如果您的控件不符合单元模型规则，则
	// 必须修改如下代码，将第六个参数从
	// afxRegApartmentThreading 改为 0。

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
  IDS_ACTIVEX, //这里的COcxCtrl为大写
  IDB_ACTIVEX, //这里的COcxCtrl为大写
  afxRegApartmentThreading,
  _dwactivexOleMisc,
  _tlid,
  _wVerMajor,
  _wVerMinor);
 else
 return AfxOleUnregisterClass(m_clsid, m_lpszProgID);
}


// COcxCtrl::COcxCtrl - 构造函数

COcxCtrl::COcxCtrl()
{
	InitializeIIDs(&IID_Dactivex, &IID_DactivexEvents);
	// TODO: 在此初始化控件的实例数据。
}



// COcxCtrl::~COcxCtrl - 析构函数

COcxCtrl::~COcxCtrl()
{
	// TODO: 在此清理控件的实例数据。
}



// COcxCtrl::OnDraw - 绘图函数

void COcxCtrl::OnDraw(
			CDC* pdc, const CRect& rcBounds, const CRect& rcInvalid)
{
	if (!pdc)
		return;

	// TODO: 用您自己的绘图代码替换下面的代码。
	pdc->FillRect(rcBounds, CBrush::FromHandle((HBRUSH)GetStockObject(WHITE_BRUSH)));
	pdc->Ellipse(rcBounds);

	if (!IsOptimizedDraw())
	{
		// 容器不支持优化绘图。

		// TODO: 如果将任何 GDI 对象选入到设备上下文 *pdc 中，
		//		请在此处恢复先前选定的对象。
	}
}



// COcxCtrl::DoPropExchange - 持久性支持

void COcxCtrl::DoPropExchange(CPropExchange* pPX)
{
	ExchangeVersion(pPX, MAKELONG(_wVerMinor, _wVerMajor));
	COleControl::DoPropExchange(pPX);

	// TODO: 为每个持久的自定义属性调用 PX_ 函数。
}



// COcxCtrl::GetControlFlags -
// 自定义 MFC 的 ActiveX 控件实现的标志。
//
DWORD COcxCtrl::GetControlFlags()
{
	DWORD dwFlags = COleControl::GetControlFlags();


	// 控件通过不还原设备上下文中的
	// 原始 GDI 对象，可以优化它的 OnDraw 方法。
	dwFlags |= canOptimizeDraw;
	return dwFlags;
}



// COcxCtrl::OnResetState - 将控件重置为默认状态

void COcxCtrl::OnResetState()
{
	COleControl::OnResetState();  // 重置 DoPropExchange 中找到的默认值

	// TODO: 在此重置任意其他控件状态。
}



// COcxCtrl::AboutBox - 向用户显示“关于”框

void COcxCtrl::AboutBox()
{
	CDialogEx dlgAbout(IDD_ABOUTBOX_ACTIVEX);
	dlgAbout.DoModal();
}



// COcxCtrl 消息处理程序
