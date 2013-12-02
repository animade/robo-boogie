<?php

class Robot extends DataMapper {

    var $has_many    = array('dance');

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
