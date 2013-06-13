// OcxPpg.cpp : COcxPropPage 属性页类的实现。

#include "stdafx.h"
#include "activex.h"
#include "OcxPpg.h"

#ifdef _DEBUG
#define new DEBUG_NEW
#endif


IMPLEMENT_DYNCREATE(COcxPropPage, COlePropertyPage)



// 消息映射

BEGIN_MESSAGE_MAP(COcxPropPage, COlePropertyPage)
END_MESSAGE_MAP()



// 初始化类工厂和 guid

IMPLEMENT_OLECREATE_EX(COcxPropPage, "ACTIVEX.OcxPropPage.1",
	0xb74b66fb, 0x80d7, 0x4b82, 0xa0, 0x69, 0x78, 0xeb, 0x7a, 0xe2, 0xb2, 0xc3)



// COcxPropPage::COcxPropPageFactory::UpdateRegistry -
// 添加或移除 COcxPropPage 的系统注册表项

BOOL COcxPropPage::COcxPropPageFactory::UpdateRegistry(BOOL bRegister)
{
	if (bRegister)
		return AfxOleRegisterPropertyPageClass(AfxGetInstanceHandle(),
			m_clsid, IDS_ACTIVEX_PPG);
	else
		return AfxOleUnregisterClass(m_clsid, NULL);
}



// COcxPropPage::COcxPropPage - 构造函数

COcxPropPage::COcxPropPage() :
	COlePropertyPage(IDD, IDS_ACTIVEX_PPG_CAPTION)
{
}



// COcxPropPage::DoDataExchange - 在页和属性间移动数据

void COcxPropPage::DoDataExchange(CDataExchange* pDX)
{
	DDP_PostProcessing(pDX);
}



// COcxPropPage 消息处理程序
