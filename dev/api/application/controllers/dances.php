<?php

require(APPPATH . 'libraries/REST_Controller.php');  

class Dances extends REST_Controller {  


    // --------------------------------------------------------------------
    
    /**
     * Gets a list of dances
     */
    function dances_get()
    {
        
        $dance          = new Dance();

        $example_ids    = array(
            '5281068541414',
            '5281029d56337',
            '5281017967e1e',
            '5280e42a38b40',
            '5280e4e19b9e8',
            '5280c68fa4b52'
        );

        $dance->where_in('guid', $example_ids);
        $dance->get();

        $output = array();

        foreach ($dance as $d)
        {   
            array_push($output, json_decode($d->move));
            
        }

        $this->response($output);    

    }
    

    // --------------------------------------------------------------------
    
    /**
     * Gets a single dance
     */

    function dance_get() {  

        $guid           = $this->uri->segment(3);

        $dance          = new Dance();

        $dance->get_by_guid($guid);

        if ($dance->exists()) {

            // Get the robot id and name - used in the stage view
            $dance->soundtrack->get();
            $dance->robot->get();
            $dance->user->get();

            $decoded_move               = json_decode($dance->move);   

            $decoded_move->sound_id     = $dance->soundtrack->id;
            $decoded_move->robot_id     = $dance->robot->id;
            $decoded_move->robot_name   = $dance->robot_name;
            $decoded_move->robot_still  = $dance->robot_still;
            $decoded_move->uuid         = $dance->user->uuid;
            $decoded_move->is_entered_into_comp         = $dance->is_entered_into_comp;
            $decoded_move->danceFound   = true;
            
            /* Add audio for this dance
             ------------------------------------------------- */
            
            switch ($decoded_move->sound_id) {
                case 1:
                    $audio_filename     = 'electro';
                break;
                
                case 2:
                    $audio_filename     = 'funk';
                break;

                case 3:
                    $audio_filename     = 'pop';
                break;

                case 4:
                    $audio_filename     = 'rock';
                break;

                default:
                    $audio_filename     = 'electro';
                break;
            }

            $soundtrack                 = array(
                'mp3'   => '/assets/music/loops/' .$audio_filename . '.mp3',
                'ogg'   => '/assets/music/loops/' .$audio_filename . '.ogg',
                'wav'   => '/assets/music/loops/' .$audio_filename . '.wav'
            );

            $decoded_move->soundtrack   = $soundtrack;
            

            $output                     = array($decoded_move);

        } else {

            $output                     = array('danceFound' => false);

        }

        $this->response($output);  

    }

    // --------------------------------------------------------------------
    
    /**
     * Saves a dance move
     */
    
    function dance_post() {
        
        
        $uuid                           = $this->post("uuid");
        $guid                           = $this->post("guid");
        $robot_id                       = $this->post("robot_id");
        $sound_id                       = $this->post("sound_id");
        $robot_name                     = $this->post("robot_name");
        $robot_still                    = $this->post("robot_still");
        $is_entered_into_comp           = ($this->post("is_entered_into_comp") == 1) ? 1 : 0;


        /* Save the main data into a json encoded array
         ------------------------------------------------- */
        
        $move  = array(
            "masterTempo" => $this->post("masterTempo"),
            "neck_tempoMultiplier" => $this->post("neck_tempoMultiplier"),
            "neck_upDown" => $this->post("neck_upDown"),
            "neck_leftRight" => $this->post("neck_leftRight"),
            "rightForearm_reverse" => $this->post("rightForearm_reverse"),
            "rightForearm_tempoMultiplier" => $this->post("rightForearm_tempoMultiplier"),
            "rightForearm_amount" => $this->post("rightForearm_amount"),
            "rightForearm_angle" => $this->post("rightForearm_angle") ,
            "rightUpperArm_reverse" => $this->post("rightUpperArm_reverse"),
            "rightUpperArm_tempoMultiplier" => $this->post("rightUpperArm_tempoMultiplier"),
            "rightUpperArm_amount" => $this->post("rightUpperArm_amount"),
            "rightUpperArm_angle" => $this->post("rightUpperArm_angle"),
            "leftForearm_reverse" => $this->post("leftForearm_reverse"),
            "leftForearm_tempoMultiplier" => $this->post("leftForearm_tempoMultiplier") ,
            "leftForearm_amount" => $this->post("leftForearm_amount"),
            "leftForearm_angle" => $this->post("leftForearm_angle"),
            "leftUpperArm_reverse" => $this->post("leftUpperArm_reverse"),
            "leftUpperArm_tempoMultiplier" => $this->post("leftUpperArm_tempoMultiplier"),
            "leftUpperArm_amount" => $this->post("leftUpperArm_amount"),
            "leftUpperArm_angle" => $this->post("leftUpperArm_angle"),
            "hips_tempoMultiplier" => $this->post("hips_tempoMultiplier"),
            "hips_upDown" => $this->post("hips_upDown"),
            "hips_leftRight" => $this->post("hips_leftRight")
        );
    
        $encoded_move      = json_encode($move);

        /* Save it
         ------------------------------------------------- */
        
        $dance     = new Dance();

        $dance->get_by_guid($guid);

        if ($dance->exists()) {

            $dance->move            = $encoded_move;
            $dance->date_updated    = mktime();
            $dance->robot_name      = $robot_name;
            $dance->robot_still     = $robot_still;
            $dance->is_entered_into_comp     = $is_entered_into_comp;

            // Save the soundtrack to the dance

            $soundtrack             = new Soundtrack();
            $soundtrack->get_by_id($sound_id);
            $dance->save($soundtrack);

            $output                 = ($dance->save()) ? $dance->guid : 'Error';

        } else {

            /* New dance 
             ------------------------------------------------- */
            
            $user       = new User();

            $user->get_by_uuid($uuid);

            if ($user->exists()) {

                // Dance doesn't exist, create it
                $new_dance                  = new Dance();
                $new_dance->guid            = uniqid();
                $new_dance->move            = $encoded_move;
                $new_dance->date_created    = mktime();
                $new_dance->date_updated    = mktime();
                $new_dance->robot_name      = $robot_name;
                $new_dance->robot_still     = $robot_still;
                $new_dance->is_entered_into_comp     = $is_entered_into_comp;


                // Save the dance on the user
                if ($new_dance->save($user)) {

                    // Save the robot to the dance

                    $robot                  = new Robot();
                    $robot->get_by_id($robot_id);
                    $new_dance->save($robot);

                    // Save the soundtrack to the dance

                    $soundtrack             = new Soundtrack();
                    $soundtrack->get_by_id($sound_id);
                    $new_dance->save($soundtrack);

                    $output                 = $new_dance->guid;

                } 
                
            } else {

                $output     = "Error";
                // $output         = "unable to find user with UUID ". $uuid;

            }

        }
        
        
        /* Return the data
         ------------------------------------------------- */
        
        $this->response($output);  

    }

    // --------------------------------------------------------------------
    
    /**
     * Creates a new dance
     */
 
    
    function dance_put() {

        /* User ID
         ------------------------------------------------- */
        
        $uuid                           = $this->put("uuid");
        $guid                           = $this->put("guid");
        $robot_id                       = $this->put("robot_id");
        $sound_id                       = $this->put("sound_id");
        $robot_name                     = $this->put("robot_name");
        $robot_still                    = $this->put("robot_still");
        $is_entered_into_comp           = ($this->put("is_entered_into_comp") == 1) ? 1 : 0;


        /* Save the main data into a json encoded array
         ------------------------------------------------- */
        
        $move  = array(
            "masterTempo" => $this->put("masterTempo"),
            "neck_tempoMultiplier" => $this->put("neck_tempoMultiplier"),
            "neck_upDown" => $this->put("neck_upDown"),
            "neck_leftRight" => $this->put("neck_leftRight"),
            "rightForearm_reverse" => $this->put("rightForearm_reverse"),
            "rightForearm_tempoMultiplier" => $this->put("rightForearm_tempoMultiplier"),
            "rightForearm_amount" => $this->put("rightForearm_amount"),
            "rightForearm_angle" => $this->put("rightForearm_angle") ,
            "rightUpperArm_reverse" => $this->put("rightUpperArm_reverse"),
            "rightUpperArm_tempoMultiplier" => $this->put("rightUpperArm_tempoMultiplier"),
            "rightUpperArm_amount" => $this->put("rightUpperArm_amount"),
            "rightUpperArm_angle" => $this->put("rightUpperArm_angle"),
            "leftForearm_reverse" => $this->put("leftForearm_reverse"),
            "leftForearm_tempoMultiplier" => $this->put("leftForearm_tempoMultiplier") ,
            "leftForearm_amount" => $this->put("leftForearm_amount"),
            "leftForearm_angle" => $this->put("leftForearm_angle"),
            "leftUpperArm_reverse" => $this->put("leftUpperArm_reverse"),
            "leftUpperArm_tempoMultiplier" => $this->put("leftUpperArm_tempoMultiplier"),
            "leftUpperArm_amount" => $this->put("leftUpperArm_amount"),
            "leftUpperArm_angle" => $this->put("leftUpperArm_angle"),
            "hips_tempoMultiplier" => $this->put("hips_tempoMultiplier"),
            "hips_upDown" => $this->put("hips_upDown"),
            "hips_leftRight" => $this->put("hips_leftRight")
        );
    
        $encoded_move      = json_encode($move);

        /* Save it
         ------------------------------------------------- */
        
        $dance     = new Dance();

        $dance->get_by_guid($guid);

        if ($dance->exists()) {

            $dance->move            = $encoded_move;
            $dance->date_updated    = mktime();
            $dance->robot_name      = $robot_name;
            $dance->robot_still     = $robot_still;
            $dance->is_entered_into_comp   = $is_entered_into_comp;

            // Save the soundtrack to the dance

            $soundtrack             = new Soundtrack();
            $soundtrack->get_by_id($sound_id);
            $dance->save($soundtrack);

            $output                 = ($dance->save()) ? $dance->guid : 'Error';

        } else {

            /* New dance 
             ------------------------------------------------- */
            
            $user       = new User();

            $user->get_by_uuid($uuid);

            if ($user->exists()) {

                // Dance doesn't exist, create it
                $new_dance                  = new Dance();
                $new_dance->guid            = uniqid();
                $new_dance->move            = $encoded_move;
                $new_dance->date_created    = mktime();
                $new_dance->date_updated    = mktime();
                $new_dance->robot_name      = $robot_name;
                $new_dance->robot_still     = $robot_still;
                $new_dance->is_entered_into_comp   = $is_entered_into_comp;


                // Save the dance on the user
                if ($new_dance->save($user)) {

                    // Save the robot to the dance

                    $robot                  = new Robot();
                    $robot->get_by_id($robot_id);
                    $new_dance->save($robot);

                    // Save the soundtrack to the dance

                    $soundtrack                  = new Soundtrack();
                    $soundtrack->get_by_id($sound_id);
                    $new_dance->save($soundtrack);

                    $output                 = $new_dance->guid;

                } 
                
            } else {

                $output     = "Error";
                // $output         = "unable to find user with UUID ". $uuid;

            }

        }
        
        
        /* Return the data
         ------------------------------------------------- */
        
        $this->response($output);  
        
    }

    function dance_delete() {

        $data = array('returned: '. $this->delete('id'));  
        $this->response($data);  
        
    }

}  

?>