#pragma once

// OcxPpg.h : COcxPropPage ����ҳ���������


// COcxPropPage : �й�ʵ�ֵ���Ϣ������� OcxPpg.cpp��

class COcxPropPage : public COlePropertyPage
{
	DECLARE_DYNCREATE(COcxPropPage)
	DECLARE_OLECREATE_EX(COcxPropPage)

// ���캯��
public:
	COcxPropPage();

// �Ի�������
	enum { IDD = IDD_PROPPAGE_ACTIVEX };

// ʵ��
protected:
	virtual void DoDataExchange(CDataExchange* pDX);    // DDX/DDV ֧��

// ��Ϣӳ��
protected:
	DECLARE_MESSAGE_MAP()
};

