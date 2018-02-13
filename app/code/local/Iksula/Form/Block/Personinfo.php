<?php
class Iksula_Form_Block_Personinfo extends Mage_Core_Block_Template
{
	public function getActionOfForm()
	{
		return $this->getUrl('form/index/createPerson');
	}
}
?>