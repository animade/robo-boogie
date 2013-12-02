<?php

require(APPPATH . 'libraries/REST_Controller.php');  

class Robots extends REST_Controller {  

    function robot_get() {

        $data = array('robot_get: '. $this->get('id'));  
        $this->response($data);  

    }

    // --------------------------------------------------------------------
    
    /**
     * Creates a new robot - Redundant, just save when sharing the dance :-/
     */
   
    function robot_put() {
        
        $robot_id           = $this->put('id');
        $uuid               = $this->put('uuid');

        $output             = "";

        /* Check for an existing robot relationship
         ------------------------------------------------- */
        
        // $user               = new User();

        // $user->get_by_uuid($uuid);

        // if ($user->exists()) {

        //     /* Check to see if this user has used this robot before
        //     ------------------------------------------------- */
            
        //     $robot              = new Robot();

        //     $robot->get_by_id($robot_id);

        //     if ($user->save($robot)) {

        //         $output     = "Robot/user relationship saved";

        //     } else {

        //         $output     = "Unable to save robot relationship";

        //     }



        // } else {

        //     $output         = "unable to find user with UUID ". $uuid;

        // }
        
        $this->response($output);  

    }

    function robot_post() {

        $data = array('robot_post: '. $this->post('id'));  
        $this->response($data);  
        
    }

    function robot_delete() {

        $data = array('robot_delete: '. $this->delete('id'));  
        $this->response($data);  
        
    }

}  

?>