<?php

class Hello_All_IndexController extends Mage_Adminhtml_Controller_Action
{
    public function indexAction()
    {
    	//echo "hii";exit;
        $this->loadLayout();

        $block = $this->getLayout()->createBlock('core/text')->setText('<h1>This is a text block</h1>');

        $this->_addContent($block);

        $this->renderLayout();
    }

    public function secAction()
    {
    	//echo "hii";exit;
        $this->loadLayout();

        $block = $this->getLayout()->createBlock('core/text')->setText('<h1>This is a block</h1>');

        $this->_addContent($block);

        $this->renderLayout();
    }

    public function sectionAction()
    {
    	//echo "hii";exit;
        $this->loadLayout();

        $block = $this->getLayout()->createBlock('core/text')->setText('<h1>This is a text</h1>');

        $this->_addContent($block);
        $this->renderLayout();
    }

    public function htmlAction()
    {
    	//echo "hii";exit;
        $this->loadLayout();

        $block = $this->getLayout()->createBlock('core/text')->setText('<h1>This is a new text block</h1>');

        $this->_addContent($block);
        $this->renderLayout();
    }
}
?>