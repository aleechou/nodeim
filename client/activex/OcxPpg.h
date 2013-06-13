#pragma once

// OcxPpg.h : COcxPropPage 属性页类的声明。


// COcxPropPage : 有关实现的信息，请参阅 OcxPpg.cpp。

class COcxPropPage : public COlePropertyPage
{
	DECLARE_DYNCREATE(COcxPropPage)
	DECLARE_OLECREATE_EX(COcxPropPage)

// 构造函数
public:
	COcxPropPage();

// 对话框数据
	enum { IDD = IDD_PROPPAGE_ACTIVEX };

// 实现
protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV 支持

// 消息映射
protected:
	DECLARE_MESSAGE_MAP()
};

