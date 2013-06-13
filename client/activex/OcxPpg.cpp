// OcxPpg.cpp : COcxPropPage ����ҳ���ʵ�֡�

#include "stdafx.h"
#include "activex.h"
#include "OcxPpg.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


IMPLEMENT_DYNCREATE(COcxPropPage, COlePropertyPage)



// ��Ϣӳ��

BEGIN_MESSAGE_MAP(COcxPropPage, COlePropertyPage)
END_MESSAGE_MAP()



// ��ʼ���๤���� guid

IMPLEMENT_OLECREATE_EX(COcxPropPage, "ACTIVEX.OcxPropPage.1",
	0xb74b66fb, 0x80d7, 0x4b82, 0xa0, 0x69, 0x78, 0xeb, 0x7a, 0xe2, 0xb2, 0xc3)



// COcxPropPage::COcxPropPageFactory::UpdateRegistry -
// ��ӻ��Ƴ� COcxPropPage ��ϵͳע�����

BOOL COcxPropPage::COcxPropPageFactory::UpdateRegistry(BOOL bRegister)
{
	if (bRegister)
		return AfxOleRegisterPropertyPageClass(AfxGetInstanceHandle(),
			m_clsid, IDS_ACTIVEX_PPG);
	else
		return AfxOleUnregisterClass(m_clsid, NULL);
}



// COcxPropPage::COcxPropPage - ���캯��

COcxPropPage::COcxPropPage() :
	COlePropertyPage(IDD, IDS_ACTIVEX_PPG_CAPTION)
{
}



// COcxPropPage::DoDataExchange - ��ҳ�����Լ��ƶ�����

void COcxPropPage::DoDataExchange(CDataExchange* pDX)
{
	DDP_PostProcessing(pDX);
}



// COcxPropPage ��Ϣ�������
