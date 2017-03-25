<?php 

namespace Reflar\UserManagement\Listeners;

use Flarum\Event\UserWasRegistered;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\Message;
use Symfony\Component\Translation\TranslatorInterface;

class RegistrationMailer
{
  
    /**
     * @var Mailer
     */
    protected $mailer;
    /**
     * @var TranslatorInterface
     */
    protected $translator;
    /**
     * @param TranslatorInterface $translator
     * @param Mailer $mailer
     */
    public function __construct(Mailer $mailer, TranslatorInterface $translator)
    {
        $this->mailer = $mailer;
        $this->translator = $translator;
    }
  
    /**
     * @param Dispatcher $events
     */
    public function subscribe(Dispatcher $events)
    {
        $events->listen(UserWasRegistered::class, [$this, 'mailer']);
    }
  
    public function mailer(UserWasRegistered $event)
    {
      $email = $event->user->email;
      $text =  $this->translator->trans('ReFlar-registration.mail.body');
      $this->mailer->queue(['raw' => $text], [], function (Message $message) use ($email, $subject) {
            $message->to($email);
            $message->subject('[' . $this->settings->get('forum_title') . '] ' . $this->translator->trans('ReFlar-registration.mail.subject'));
        });
    }
}