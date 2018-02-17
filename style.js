$(function(){

	//Caching elements

	//General elements

	$Container=$('#container');
	$Video_Container=$('#Video_Container');
	$Video_Screen=$('#Video_Screen');
	$Play_Wrap=$('#Playlist_Wrapper');
	$Video=$('video');
	$Source=$('video source')
	var Video=$Video.get(0);
	$List_Wrap=$('.List_Wrapper')
	$List=$('.List');

	//Controls

	$Play=$('.Play_Button');
	$Pause=$('.Pause_Button');
	$Rewind=$('.Rewind');
	$Fast_Forward=$(".Fast_Forward");
	$Mute=$('.Unmute');
	$Unmute=$('.Mute');
	$Checker=$('.checker');
	$Shuffle=$('.Shuffle');
	$Shuffle.addClass('off');

	$Shuffle.on('click',function(){
		if(Shuffle.hasClass('on'))
		{
			Shuffle.addClass('off');
			Shuffle.removeClass('on');
		}
		else if(Shuffle.hasClass('off')){
			Shuffle.addClass('on');
			Shuffle.removeClass('off');
		}
	})

	//Rewinding and fast-forwarding of video

	function skipback(value){
		Video.currentTime-=1;
	}

	$Rewind.mousedown(function(){
		x=setInterval(skipback,100);
	})
	$Rewind.mouseup(function(){
		clearInterval(x);
	})
	function skipforward(value){
		Video.currentTime+=1;
	}

	$Fast_Forward.mousedown(function(){
		y=setInterval(skipforward,100);
	})
	$Fast_Forward.mouseup(function(){
		clearInterval(y);
	})

	//Mute and Unmute 

	$Mute.on('click',function(){
		Video.muted=true;
		$Mute.css({
			'display':'none'
		})
		$Unmute.css({
			'display':'inline'
		})
	})
	$Unmute.on('click',function(){
		Video.muted=false;
		$Mute.css({
			'display':'inline'
		})
		$Unmute.css({
			'display':'none'
		})
	})

	//Controlling Volume

	//Define Variables

	$HTML=$('html');
	$Volume=$('#Volume_Bar');
	$Vol_Width=$('#Volume').css('width');
	$Initial_Vol=$Volume.attr('value');
	var Final_Vol;
	var Vol;


	Final_Vol=$Volume.val();
	Vol=(Final_Vol/100)*(parseInt($Vol_Width));
	$('#Volume_in').css('width',Vol);

	//Initialize video volume with volume bar value
	
	Video.volume=$Initial_Vol/100;

	//Show or Hide volume slider thumb

	$Volume.on('mouseover',function(){
		$Volume.addClass('Thumb').hide().fadeIn(250);
	});
	$Volume.on('mouseout',function(){
		$Volume.removeClass('Thumb');
	});

	//Change cursor while volume manipulation

	$Volume.on('mousedown',function(){
		$HTML.css({
			'cursor':'pointer'
		})
	})
	$Volume.on('mouseup',function(){
		$HTML.css({
			'cursor':'default'
		})
	})

	//Change volume

	$Volume.on('input',function(){
		Final_Vol=$Volume.val();
		$('#Volume_in').animate({'width':Final_Vol+'%'},50);
		Video.volume=Final_Vol/100;
	})
	
	//Controlling Video time

	$Video_Duration=parseInt(Video.duration);
	$Pro_Width=$('#Progress').css('width');  	
	$Progress=$('#Progress_Bar');

	//Show or Hide progress slider thumb

	$Progress.on('mouseover',function(){
		$Progress.addClass('Thumb').hide().fadeIn(250);;
	});
	$Progress.on('mouseout',function(){
		$Progress.removeClass('Thumb');
	});

	//Change cursor while progress manipulation

	$Progress.on('mousedown',function(){
		$HTML.css({
			'cursor':'pointer'
		})
	})
	$Progress.on('mouseup',function(){
		$HTML.css({
			'cursor':'default'
		})
	})


	var Progress_Value;

	$Progress.on('input',function(){
		Duration=Video.duration;
		Progress_Value=$Progress.val();
	var i = setInterval(function(){
		if(Video.readyState > 0){
			CurrentTime=(Duration*Progress_Value)/100;
			Video.currentTime=CurrentTime;
		clearInterval(i);
		}
	},100);
	})
	n=1;
	var CheckR;
	function startVid(){
			Duration=Video.duration;
			CurrentTime=Video.currentTime;
			$Progress.val(CurrentTime/Duration*100);
			$Pro=$Progress.val();
			$('#Progress_in').css('width',$Pro+'%');
			
			$List_Wrap.on('click','li',function(event){
				id=this;
				$List.each(function(index){
				if($List.eq(index).is(id))
				{
					Video.pause();
					$Video.attr('src',null);
					Video.src=$Source.eq(index).attr('src');
					n=index;
					Video.play();
				}
			})
			})

			if(Video.duration==Video.currentTime)
			{
				//Check autoplay

				if($Checker.is(":checked"))
				{
					//Check Shuffle
					if($Shuffle.hasClass('on'))
					{	
						Random=Math.floor((Math.random()*$Source.size()))
						if(CheckR==Random)
						{
							Random-=2;
							if(Random<0)
							{
								Random+=4;
							}
						}
						Video.src=$Source.eq(Random).attr('src');
						CheckR=Random
						Video.play();
						if(n>=$Source.size())
						n=0;
					}
					else{
						n++;
						if(n>=$Source.size())
						n=0;
						Video.src=$Source.eq(n).attr('src');
						Video.play();
					}
				}
				else{
					Video.currentTime=0;
					Duration=Video.duration;
					CurrentTime=Video.currentTime;
					$Progress.val(CurrentTime/Duration*100);
					$Pro=$Progress.val();
					Video.pause();
					$('#Progress_in').css('width',$Pro+'%');
				}
			}
			if(Video.paused)
			{
				$Play.css({
					'display':'inline'
				})
				$Pause.css({
				'display':'none'
				})
			}
			else{
				$Play.css({
					'display':'none'
				})
				$Pause.css({
				'display':'inline'
				})
			}
			$List.each(function(index){
				if($Source.eq(index).attr('src')==$Video.attr('src'))
				{
					$List.eq(index).addClass('Run');
					$List.each(function(x){
						if(x!=index)
							$List.eq(x).removeClass('Run');
					})
				}
			})
	}

	//Play and Pausing of Video

	//Always running Interval

	k=setInterval(startVid,100)

	//Play
	$Play.on('click',function(){
		Video.play();
		$Play.css({
			'display':'none'
		})
		k=setInterval(startVid,100)
		
		$Pause.css({
			'display':'inline'
		})
	})

	//Pause

	$Pause.on('click',function(){
		Video.pause();
		$Play.css({
			'display':'inline'
		})
		$Pause.css({
			'display':'none'
		})
	})

	//Positioning of tooltip

	//ToolTip varialbles

	var UnmuteTip=$('.UnmuteTip')
	var MuteTip=$('.MuteTip')
	var VolumeTip=$('.VolumeTip')
	var SbackTip=$('.SbackTip')
	var RewindTip=$('.RewindTip')
	var PlayTip=$('.PlayTip')
	var PauseTip=$('.PauseTip')
	var ForwardTip=$('.ForwardTip')
	var SforTip=$('.SforTip')
	var DownloadTip=$('.DownloadTip')
	var CogTip=$('.CogTip')
	var FullscreenTip=$('.FullscreenTip')
	var ProgressTip=$('.ProgressTip')
	var AutoplayTip=$('.AutoplayTip')
	var ShuffleTip=$('.ShuffleTip')
	
	//Controls variable

	var Unmute=$('.Mute')
	var Mute=$('.Unmute')
	var Sbackward=$('.Sbackward')
	var Rewind=$('.Rewind')
	var Play_Button=$('.Play_Button')
	var Pause_Button=$('.Pause_Button')
	var Fast_Forward=$('.Fast_Forward')
	var Sforward=$('.Sforward')
	var Download=$('.Download')
	var Cog=$('.Cog')
	var Fullscreen=$('.Fullscreen')

	//Tool Tip for Shuffle

	var Shuffle=$('.Shuffle')
	Shuffle.on('mouseover',function(){
		ShuffleTip.css('display','inline')
	})
	Shuffle.on('mouseout',function(){
		ShuffleTip.css('display','none')
	})

	//Tool Tip for Autoplay
	
	var Switch=$('.switch')
	Switch.on('mouseover',function(){
		AutoplayTip.css('display','inline');
	})
	Switch.on('mouseout',function(){
		AutoplayTip.css('display','none');
	})

	//Tool Tip for Shuffle

	//Tool tip for Progress

	var Progress_Bar=$('#Progress_Bar')

	Progress_Bar.on('mousemove',function(e){
		ProgressTip.css({
			'display':'inline',
		});
		$Left=e.pageX-Progress_Bar.offset().left;
		$BarWidth=parseInt(Progress_Bar.css('width'));
		$Width=parseInt(ProgressTip.css('width'))/2;
		$Duration=Video.duration;
		$ChangeTime=((($Duration/100)*$Left/$BarWidth*100));
		$Minutes=parseInt($ChangeTime/60);
		$Seconds=parseInt($ChangeTime%60);
		if($Left>=0 && $Left/$BarWidth*100<=100)
		{
			if($Minutes<10)
				i=0;
			else
				i="";
			if($Seconds<10)
				j=0;
			else
				j="";
			ProgressTip.text(i+""+$Minutes+':'+j+""+$Seconds);
			ProgressTip.css('left',$Left-$Width);
		}
		else{
			ProgressTip.css('display','none')
		}
	})
	Progress_Bar.on('mouseout',function(){
		ProgressTip.css('display','none');
	})

	//Tool tip for Volume

	var Volume_Bar=$('#Volume_Bar')

	Volume_Bar.on('mousemove',function(e){
		VolumeTip.css('display','inline');
		$VolumeOffset=Volume_Bar.offset().left;
		$Left=e.pageX - $VolumeOffset;
		$Width=parseInt(VolumeTip.css('width'));
		$Bar_Width=parseInt(Volume_Bar.css('width'))
		if($Left>=0 && ($Left/$Bar_Width*100)<=100)
		{
			VolumeTip.text('Volume ' + ($Left/$Bar_Width*100).toFixed(0)+'%');
			VolumeTip.css('left',$Left);
		}else{
			VolumeTip.css('display','none')
		}
		
	})
	Volume_Bar.on('mouseout',function(){
		VolumeTip.css('display','none');
	})

	//ToolTips for control butttons

	$Container.on('mousemove',function(e){
		var Target=e.target;
		$ContainerOffset=$Container.offset().left;
		if(Target==$(Mute)[0])
		{
			MuteTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(MuteTip.css('width'))/2;
			MuteTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				MuteTip.css('display','none');
			})
		}
		if(Target==$(Unmute)[0])
		{
			UnmuteTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(UnmuteTip.css('width'))/2;
			UnmuteTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				UnmuteTip.css('display','none');
			})
		}
		if(Target==$(Sbackward)[0])
		{
			SbackTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(SbackTip.css('width'))/2;
			SbackTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				SbackTip.css('display','none');
			})
		}
		if(Target==$(Rewind)[0])
		{
			RewindTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(RewindTip.css('width'))/2;
			RewindTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				RewindTip.css('display','none');
			})
		}
		if(Target==$(Play_Button)[0])
		{
			PlayTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(PlayTip.css('width'))/2;
			PlayTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				PlayTip.css('display','none');
			})
		}
		if(Target==$(Pause_Button)[0])
		{
			PauseTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(PauseTip.css('width'))/2;
			PauseTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				PauseTip.css('display','none');
			})
		}
		if(Target==$(Fast_Forward)[0])
		{
			ForwardTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(ForwardTip.css('width'))/2;
			ForwardTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				ForwardTip.css('display','none');
			})
		}
		if(Target==$(Sforward)[0])
		{
			SforTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(SforTip.css('width'))/2;
			SforTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				SforTip.css('display','none');
			})
		}
		
		if(Target==$(Download)[0])
		{
			DownloadTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(DownloadTip.css('width'))/2;
			DownloadTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				DownloadTip.css('display','none');
			})
		}
		if(Target==$(Cog)[0])
		{
			CogTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(CogTip.css('width'))/2;
			CogTip.css('left',$Left-$Width);
			$(Target).on('mouseout',function(){
				CogTip.css('display','none');
			})
		}
		if(Target==$(Fullscreen)[0])
		{
			FullscreenTip.css('display','inline');
			$Left=e.pageX - $ContainerOffset;
			$Width=parseInt(FullscreenTip.css('width'))/2;
			FullscreenTip.css('left',$Left-$Width-40);
			$(Target).on('mouseout',function(){
				FullscreenTip.css('display','none');
			})
		}
	})

	//Show current and remaining time

	$Current=$('.Current');
	$Remain=$('.Remain');
	$Current.text('00:00');
	RTime=parseInt(Video.duration)-parseInt(Video.currentTime);
		RMinute=parseInt(RTime/60);
		RSecond=parseInt(RTime%60);
		if(RMinute<10)
			i=0
		else
			i="";
		if(RSecond<10)
			j=0
		else
			j="";
	$Remain.text('-' + i+""+RMinute+':'+j+""+RSecond)


	function ShowCurrent(){
		CTime=Video.currentTime;
		CMinute=parseInt(CTime/60);
		CSecond=parseInt(CTime%60);
		if(CMinute<10)
			i=0
		else
			i="";
		if(CSecond<10)
			j=0
		else
			j="";
		$Current.text(i+""+CMinute+':'+j+""+CSecond)
	}

	var l=setInterval(ShowCurrent,100)
	var j=setInterval(ShowRemain,100)
	
	Play_Button.on('click',function(){
		var l=setInterval(ShowCurrent,100)
		var j=setInterval(ShowRemain,100)
	});

	function ShowRemain(){
		RTime=parseInt(Video.duration)-parseInt(Video.currentTime);
		RMinute=parseInt(RTime/60);
		RSecond=parseInt(RTime%60);
		if(RMinute<10)
			i=0
		else
			i="";
		if(RSecond<10)
			j=0
		else
			j="";
		$Remain.text('-' + i+""+RMinute+':'+j+""+RSecond)
	}

	Pause_Button.on('click',function(){
		clearInterval(l);
		clearInterval(j);
	});

	//Get all the videos source
	
	var n=1;
	
	Sforward.on('click',function(){
		Video.src=$Source.eq(n).attr('src');
		Play_Button.css('display','inline');
		Pause_Button.css('display','none')
		n++;
		if(n>=$Source.size())
			n=0;
	})
	var m=n-2;
	
	Sbackward.on('click',function(){
		if(m<0)
		{
			m=$Source.size()-1;
		}
		Video.src=$Source.eq(m).attr('src');
		Play_Button.css('display','inline');
		Pause_Button.css('display','none')
		m--;
	})

	//Search for content
	$SearchBox=$('.SearchBox')
	$SearchInput=$('#SearchBox');
	$SearchInput.on('input',function(){
		$List.each(function(){
			Item=$(this);
			str = Item.text().toUpperCase();
			if(str.indexOf($SearchInput.val().toUpperCase())>-1)
			{
				Item.css('display','block');
			}
			else{
				Item.css('display','none');
			}
		})
	})

	$CHeight=$Container.css('height');
	$Play_Wrap.css('height',(parseInt($CHeight)-100)+'px');

	//Update height of playlist

	$(window).on('resize',function(){
		$CHeight=$Container.css('height');
		$Play_Wrap.css('height',(parseInt($CHeight)-100)+'px');
	})
	//Showing and Hiding Playlist

	$ShowTip=$('.ShowS');
	$HideTip=$('.HideS');
	$Hide=$('.Hide')
	$Show=$('.Show')
	$Show.hide();
	$Hide.on('mouseover',function(){
		$HideTip.css('display','inline');
	})
	$Hide.on('mouseout',function(){
		$HideTip.css('display','none');
	})
	$Show.on('mouseover',function(){
		$ShowTip.css('display','inline');
	})
	$Show.on('mouseout',function(){
		$ShowTip.css('display','none');
	})
	$Hide.on('click',function(){
		$Video_Container.animate({
			'width':'100%',
		},250)
		$(this).hide();
		$Show.show();
		$Video_Screen.animate({
			'width':'100%'},250);
		$Play_Wrap.css('display','none');
		$Extras=$('#Extras');
		$Extras.css('background-color','rgba(0,0,0,0)');
		$Play_Wrap.hide();
		Shuffle.fadeOut(250);
		Switch.fadeOut(250);
		$SearchBox.fadeOut(250);
	})
	$Show.on('click',function(){
		$Video_Screen.animate({'width':'100%'},250);
		$Video_Container.animate({
			'width':'65%',
		},250)
		$(this).hide();
		$Hide.show();
		$Play_Wrap.slideDown(1000);
		$Extras=$('#Extras');
		$Extras.css('background-color','white');
		$Extras.hide().fadeIn(500);
		Shuffle.fadeIn(250);
		Switch.fadeIn(250)
		$SearchBox.slideDown(250)
	})
	$SearchInput=$('#SearchBox');
	$NoMatch=$('.NoMatch');
	$NoMatch.hide();
	$SearchInput.on('input',function(){
		$List.each(function(){
			Item=$(this);
			str = Item.text().toUpperCase();
			if(str.indexOf($SearchInput.val().toUpperCase())>-1)
			{
				Item.css('display','block');
			}
			else{
				Item.css('display','none');	
			}
			tester=1;
			$List.each(function(){
				if($(this).css('display')=='block'){
					tester++;
				}
			})
			if(tester>1)
			{
				$NoMatch.hide();
			}
			else{
				$NoMatch.slideDown(250);
			}
		})
	})

});

function goFullscreen() {
  var element = document.querySelector('video');       
  if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }  
}