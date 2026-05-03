<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class FollowUpReminder extends Model { protected $fillable = ['contact_id','user_id','due_at','channel','is_done']; protected $casts=['due_at'=>'datetime','is_done'=>'boolean']; }
