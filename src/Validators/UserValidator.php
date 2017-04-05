<?php
/*
 * This file is part of Flarum/Validator/UserValidator.php
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
namespace Reflar\UserManagement\Validators;

use Flarum\Foundation\Application;
use Flarum\Core\User;
use Flarum\Core\Validator\AbstractValidator;
use Flarum\Settings\SettingsRepositoryInterface;

class UserValidator extends AbstractValidator
{
    /**
     * @var User
     */
    protected $user;
  
    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }
    /**
     * @param User $user
     */
    public function setUser(User $user)
    {
        $this->user = $user;
    }
    /**
     * {@inheritdoc}
     */
    protected function getRules()
    {        
        $idSuffix = $this->user ? ','.$this->user->id : '';
          $validator = [
              'username' => [
                  'required',
                  'regex:/^[a-z0-9_-]+$/i',
                  'unique:users,username'.$idSuffix,
                  'min:3',
                  'max:30'
              ],
              'password' => [
                  'required',
                  'min:8'
              ]
          ];
      
      
      if (app()->make(SettingsRepositoryInterface::class)->get('ReFlar-emailRegEnabled') == false)
        {
          $validator['email'] = array('required','email','unique:users,email'.$idSuffix);
        }
      
       if (app()->make(SettingsRepositoryInterface::class)->get('ReFlar-ageRegEnabled') == true)
        {
          $validator['age'] = array('required','integer','max:100');
        }
      
       if (app()->make(SettingsRepositoryInterface::class)->get('ReFlar-genderRegEnabled') == true)
        {
          $validator['gender'] = array('required','string','in:Male,Female,Other');
        }
        return $validator;
       }
    /**
     * {@inheritdoc}
     */
    protected function getMessages()
    {
        return [
            'username.regex' => $this->translator->trans('core.api.invalid_username_message')
        ];
    }
}