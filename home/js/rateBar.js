/**
 * Created by hubert lin2 on 2016/9/7.
 */

var skillBarInst = [];

var SkillBar = function (index,obj) {
    this.inst = obj;
    this.index = index;
    this.rateBar = $(obj).children();
    this.intervalInst = undefined;
    this.canReplaceFlag = false;
    this.lastWidth = undefined;
    this.polarPos = 90;
    this.amplitude = undefined;
    this.displacement = undefined;
    this.max = undefined;
    this.isVibrating = false;

    this.update().setTimer();
};
var RateBarExtender = {
    clear : function () {
        clearInterval(this.intervalInst);
        this.canReplaceFlag = true;
        return this;
    },
    reset : function (forceRight) {
        // cuz acos only return pos angle, check if prev is in negative angle area,
        //     take 185 cuz want bar go right if it is stopped and trigger again
        // var over180 = this.polarPos%360<180?1:-1;
        this.amplitude = this.max;
        this.polarPos  = Math.acos(this.displacement/this.max)*180/3.1415926;
        return this;
    },

    // update layout values not including vibrate timer
    update : function () {

        var rate = parseInt($(this.rateBar).children().text());
        this.lastWidth = $(this.inst).width()*rate/10;

        this.max = $(this.inst).children('.skillRateShadow').width()/10*2;
        if(this.amplitude==undefined) this.amplitude = this.max;
        return this;
    },
    setTimer : function (dampRatio) {

        if(dampRatio=="short"){
            dampRatio = 0.965;
        }
        else if(dampRatio=="medium"){
            dampRatio = 0.975;
        }
        else{
            dampRatio = 0.985;
        }


        clearInterval(this.intervalInst);
        var that = this;
        this.intervalInst = setInterval(function () {

            // cuz the 'new' of RateBar hasn't assigned yet on first trigger
            var inst = skillBarInst[that.index];

            inst.polarPos += 3.6;
            inst.isVibrating = true;

            if(inst.amplitude<1){
                clearInterval(inst.intervalInst);
                inst.isVibrating = false;
                inst.intervalInst = undefined;
                inst.canReplaceFlag = true;
                // inst.polarPos = undefined;
                inst.amplitude = undefined;
                return;
            }
            inst.amplitude *= dampRatio;
            inst.displacement = inst.amplitude*Math.cos(inst.polarPos/180*3.1415926);

            $(inst.inst).children('.skillRate').width(inst.lastWidth-inst.displacement);
        },10);
    }

};
$.extend(SkillBar.prototype, RateBarExtender);


function vibrateRateBar(index,obj,duration,forceRight) {

    // stop previous and get its last condition if previous is still working
    if(skillBarInst[index]!=undefined){
        skillBarInst[index].clear().reset(forceRight);
    }
    // create new
    else{
        skillBarInst[index] = new SkillBar(index,obj);
    }

    if(skillBarInst[index].canReplaceFlag==false) return;
    skillBarInst[index].setTimer(duration);

}

function updateVibrateRateBar() {
    $('.skillRate').each(function (i,inst) {
        if(skillBarInst[i]!=undefined) skillBarInst[i].update();
    });
}


// function doSomeAnimationOnLoad() {
//     $('#abilityBlock').load(function () {
//         $('.skillBar').each(function (i, inst) {
//             vibrateRateBar(i,inst,'short');
//         });
//     });
// }
// doSomeAnimationOnLoad();

function setRateBarVibrateAnimation() {
    $('.skillBar').each(function (i, inst) {
        $(inst).mouseover(function () {
            vibrateRateBar(i,this);
        });
    });
}

function createSkillRatingBar() {

    $('.skillLang').each(function (i, inst) {

        var p = $(inst).parent();
        var skillLang = $(inst);
        var skillBar = $(inst).siblings('.skillBar');
        var skillRate = $(skillBar.children()[0]);
        var skillRateShadow = $(skillBar.children()[1]);

        var HH = skillLang.height();
        var WW = p.width();
        var ow = p.outerWidth();
        var margin = (ow-WW)/2;
        var rate = parseInt(p.find('.skillRate').text());

        // var innerMaxWidth = (WW-10) - (HH*0.1)*2;

        skillBar.css({
            'bottom':0,
            'width':WW-10+'px',
            'height':HH*0.7+'px',
            'margin':HH*0.05+'px 0'
        });
        skillRateShadow.css({
            'width':(WW-10)+'px',
            'height':HH*0.7+'px',
            'border-radius':HH/2+'px'
        });
        skillRate.css({
            'width':((WW-10)*rate/10)+'px',
            'border-radius':HH/2+'px',
            'font-size':HH*0.5+'px',
            'line-height':HH*0.7+'px',
            'height':HH*0.7+'px'
        });
    });
}

function rateBarAnimationOnScroll() {

    $('.skillBar').each(function (i, inst) {
        if(!skillBarInst[i] || !skillBarInst[i].isVibrating) vibrateRateBar(i,inst,'short',true);
    });
}
