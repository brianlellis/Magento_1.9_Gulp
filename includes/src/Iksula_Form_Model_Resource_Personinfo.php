<?php
class Iksula_Form_Model_Resource_Personinfo extends Mage_Core_Model_Resource_Db_Abstract{
    protected function _construct()
    {
        $this->_init('form/personinfo', 'personinfo_id');
    }
}
?>