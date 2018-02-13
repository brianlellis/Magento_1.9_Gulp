<?php
 
class Hello_World_IndexController extends Mage_Core_Controller_Front_Action
{
    public function indexAction()
    {
        echo 'Hello developer...';
    }
 
    public function sayHelloAction()
    {
        echo 'Hello one more time...';
    }
}
?>