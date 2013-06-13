#pragma once

// OcxCtrl.h : COcxCtrl ActiveX 控件类的声明。
#include <objsafe.h> // for IObjectSafety; in ActiveX SDK

// COcxCtrl : 有关实现的信息，请参阅 OcxCtrl.cpp。

class COcxCtrl : public COleControl
{
	DECLARE_DYNCREATE(COcxCtrl)
	//........................................................................
	//ISafeObject
DECLARE_INTERFACE_MAP()
 BEGIN_INTERFACE_PART(ObjSafe, IObjectSafety)
  STDMETHOD_(HRESULT, GetInterfaceSafetyOptions) (
           REFIID riid,
           DWORD __RPC_FAR *pdwSupportedOptions,
           DWORD __RPC_FAR *pdwEnabledOptions
  );
       
       STDMETHOD_(HRESULT, SetInterfaceSafetyOptions) (
           REFIID riid,
           DWORD dwOptionSetMask,
           DWORD dwEnabledOptions
  );
 END_INTERFACE_PART(ObjSafe);
	//ISafeObject
	//........................................................................

// 构造函数
public:
	COcxCtrl();

// 重写
public:
	virtual void OnDraw(CDC* pdc, const CRect& rcBounds, const CRect& rcInvalid);
	virtual void DoPropExchange(CPropExchange* pPX);
	virtual void OnResetState();
	virtual DWORD GetControlFlags();

// 实现
protected:
	~COcxCtrl();

	DECLARE_OLECREATE_EX(COcxCtrl)    // 类工厂和 guid
	DECLARE_OLETYPELIB(COcxCtrl)      // GetTypeInfo
	DECLARE_PROPPAGEIDS(COcxCtrl)     // 属性页 ID
	DECLARE_OLECTLTYPE(COcxCtrl)		// 类型名称和杂项状态

// 消息映射
	DECLARE_MESSAGE_MAP()

// 调度映射
	DECLARE_DISPATCH_MAP()

	afx_msg void AboutBox();

// 事件映射
	DECLARE_EVENT_MAP()

// 调度和事件 ID
public:
	enum {
	};
};

