<?php

class Iksula_Form_IndexController extends Mage_Core_Controller_Front_Action
{
    public function testModelAction()
    {
    	//echo 'Setup!';
    	//$personinfo = Mage::getModel('form/personinfo');
        //echo get_class($personinfo);
        $params = $this->getRequest()->getParams();
	    $personinfo = Mage::getModel('form/personinfo');
	    echo("Loading the personinfo with an ID of ".$params['id']);
	    $personinfo->load($params['id']);
	    $data = $personinfo->getData();
	    var_dump($data);
    }

  	public function createNewPostAction()
  	{
	    $personinfo = Mage::getModel('form/personinfo');
	    $personinfo->setName('Prince');
	    $personinfo->setAddress('Kandivali(W)');
	    $personinfo->save();
	    echo 'post with ID ' . $personinfo->getId() . ' created';
	}

	public function editFirstPostAction()
	{
	    $personinfo = Mage::getModel('form/personinfo');
	    $personinfo->load(1);
	    $personinfo->setName("Vivek");
	    $personinfo->save();
	    echo 'post edited';
	}

	public function deleteFirstPostAction()
	{
	    $personinfo = Mage::getModel('form/personinfo');
	    $personinfo->load(1);
	    $personinfo->delete();
	    echo 'post removed';
	}

	public function showAllBlogPostsAction()
	{
	    $posts = Mage::getModel('form/personinfo')->getCollection();
	    foreach($posts as $personinfo)
	    {
	        echo '<h3>'.$personinfo->getName().'</h3>';
	        echo nl2br($personinfo->getPost());
	    }
	}
}
?>