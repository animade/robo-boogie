<?php

class Dance extends DataMapper {

	var $has_one 	= array('robot', 'user', 'soundtrack');

	/**
	 * Constructor: calls parent constructor
	 */
    function __construct($id = NULL)
	{
		parent::__construct($id);
    }

}

/* End of file template.php */
/* Location: ./application/models/template.php */
