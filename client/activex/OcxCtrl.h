#pragma once

// OcxCtrl.h : COcxCtrl ActiveX �ؼ����������
#include <objsafe.h> // for IObjectSafety; in ActiveX SDK

// COcxCtrl : �й�ʵ�ֵ���Ϣ������� OcxCtrl.cpp��

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

// ���캯��
public:
	COcxCtrl();

// ��д
public:
	virtual void OnDraw(CDC* pdc, const CRect& rcBounds, const CRect& rcInvalid);
	virtual void DoPropExchange(CPropExchange* pPX);
	virtual void OnResetState();
	virtual DWORD GetControlFlags();

// ʵ��
protected:
	~COcxCtrl();

	DECLARE_OLECREATE_EX(COcxCtrl)    // �๤���� guid
	DECLARE_OLETYPELIB(COcxCtrl)      // GetTypeInfo
	DECLARE_PROPPAGEIDS(COcxCtrl)     // ����ҳ ID
	DECLARE_OLECTLTYPE(COcxCtrl)		// �������ƺ�����״̬

// ��Ϣӳ��
	DECLARE_MESSAGE_MAP()

// ����ӳ��
	DECLARE_DISPATCH_MAP()

	afx_msg void AboutBox();

// �¼�ӳ��
	DECLARE_EVENT_MAP()

// ���Ⱥ��¼� ID
public:
	enum {
	};
};

