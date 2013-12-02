<?php

require(APPPATH . 'libraries/REST_Controller.php');  

class Users extends REST_Controller {  

    
    // --------------------------------------------------------------------
    
    /**
     * Gets information about a user
     */

    function user_get() {

        /* Get the user
         ------------------------------------------------- */
        
        $uuid               = $this->get('uuid');

        $existing_user      = new User();

        $existing_user->get_by_uuid($uuid);

        // Check if they exist
        if ($existing_user->exists()) {
                
            $existing_user->dance->get();

            $dances         = array();

            // Add robots and dances to their own arrays

            foreach ($existing_user->dance as $dance) {

                // Get the robots
                $dance->robot->get();

                $dances[]   = array(
                    'guid'              => $dance->guid,
                    'robot_id'          => $dance->robot->id,
                    'robot_name'        => $dance->robot_name
                );

            }

            $data = array(
                'uuid'          => $uuid,
                'dances'        => $dances
            );  

        } else {
            
            /* They don't exists, create them
             ------------------------------------------------- */
            
            $user           = new User();
            $user->uuid     = $uuid;

            if ($user->save()) {

                $data = array('uuid' => $uuid);  

            } else {

                $data = array('uuid' => false);  

            }
           

        }


        $this->response($data);  

    }

    // --------------------------------------------------------------------
    
    /**
     * Creates a new user
     */
   
    function user_put() {
        
        /* Check for an existing user
         ------------------------------------------------- */
        
        $uuid               = $this->put('uuid');

        $existing_user      = new User();

        $existing_user->get_by_uuid($uuid);

        if ($existing_user->exists()) {

            $output     = array('User with UUID '. $uuid .' already exists');  

        } else {
            
            // They don't exist, create them

            $user           = new User();
            $user->uuid     = $uuid;

            if ($user->save()) {

                $output = array('User created with UUID: '. $uuid);  

            } else {

                $output = array('Error saving user');  

            }

        }

        /* TODO - return dance and robot data here
         ------------------------------------------------- */
        
        
        $this->response($output);  

    }

    function user_post() {

        $data = array('user_post: '. $this->post('id'));  
        $this->response($data);  
        
    }

    function user_delete() {

        $data = array('user_delete: '. $this->delete('id'));  
        $this->response($data);  
        
    }

}  

?>