var wait = 0;
var heroes;
var unlockedheroes;
var heroeslength;
var enablebot = 1;
var autobuy = 1;
var autoabil = 1;
var autoreborn = 0;
var autoboss = 1;
var rebornlvl = 50;
var reborning = 0;
var reborndelay = 3000;
var reborns = 0;
var abilscreen = 0;
var rebornscreen1 = 0;
var rebornscreen2 = 0;
var freebuy = 0;
var refresh = 0;
var progressbuy = 0;
var lvllimit = ParseGold("1T");
var autoclick = 1;
var clicklimit = 1;
var loopinterval = 751;
var calls = 0;
var delay = 5000;
var reactionmin = 250;
var reactionmax = 500;

var timedelayscript = null;
var timedelayherobuy = null;
var timedelayreborn = null;
var timedelayherounlock = null;
var timedelayabilbuy = null;
var timedelayreborn2 = null;

function DelayScript()//delay start of script
{
  //setInterval(bot,loopinterval);
  bot();
  clearTimeout(timedelayscript);
  if((reborning == 2 && freebuy == 0) || rebornscreen1 || rebornscreen2)
  {
    timedelayscript = setTimeout(DelayScript,3000)
  }
  else
  {
    timedelayscript = setTimeout(DelayScript,loopinterval);
  }
}

function DelayHeroBuy(x, i)
{
  if(timedelayherobuy == null)
  {
    timedelayherobuy = setTimeout(DelayHeroBuy2,Random(reactionmin,reactionmax),x,i);
  }
}

function DelayHeroBuy2(x,i)
{
  clearTimeout(timedelayherobuy);
  timedelayherobuy = null;
  HeroBuy(x,i);
}

function DelayReborn()
{
  if(timedelayreborn == null)
  {
    timedelayreborn = setTimeout(DelayReborn2,reborndelay);
  }
}

function DelayReborn2()
{
  clearTimeout(timedelayreborn);
  timedelayreborn = null;
  if(timedelayreborn2 == null) timedelayreborn2 = setTimeout(DelayReborn3,reborndelay);
  Reborn();
}

function DelayReborn3()
{
  clearTimeout(timedelayreborn2);
  timedelayreborn2 = null;
  document.title = "REFRESH";
}

function DelayAbilBuy(abil)
{
  if(timedelayabilbuy == null)
  {
    timedelayabilbuy = setTimeout(DelayAbilBuy2,Random(reactionmin,reactionmax),abil);
  }
}

function DelayAbilBuy2(abil)
{
  clearTimeout(timedelayabilbuy);
  timedelayabilbuy = null;
  AbilBuy(abil);
}

function DelayHeroUnlock(i)
{
  if(timedelayherounlock == null)
  {
    timedelayherounlock = setTimeout(DelayHeroUnlock2,Random(reactionmin,reactionmax),i);
  }
}

function DelayHeroUnlock2(i)
{
  clearTimeout(timedelayherounlock);
  timedelayherounlock = null;
  HeroUnlock(i);
}

function Random(min,max)//random int
{
  return Math.floor((Math.random() * (max-min+1))+min);
}

function bot()//loop through features
{
  if(rebornscreen1) 
  {
    RebornScreen(1);
    return;
  }
  if(rebornscreen2) 
  {
    RebornScreen(2);
    return;
  }
  if(autoclick && ClickRange() && refresh == 0)
  {
    var popup = document.getElementsByClassName("m-popup");
    if(popup.length > 0) popup[0].children[popup[0].childElementCount-1].click();
    document.title = "CLICK";
    return;
  }
  else
  {
    if(refresh)
    {
      document.title = "REFRESH";
      return;
    }
    else
    {
      document.title = "FT"
    }
  }
  if(freebuy == 2)
  {
    return;
  }
  if(abilscreen && autoabil)
  {
    AbilScreen();
    return;
  }
  UpdateHeroes();
  if(autoabil) AutoAbil();
  if(freebuy)
  {
    FreeBuy()
    return;
  }
  if(reborning == 1) 
  {
    AutoReborn();
    return;
  }
  if(autobuy) AutoBuy();
  if(progressbuy)
  {
    ProgressBuy();
    progressbuy = 0
  }
  if(autoboss) AutoBoss();
  if(autoreborn && GetBossLevel() > rebornlvl) reborning = 1; 
}

function ProgressBuy()
{
  var ac = 0;
  SelectBuy(25);
  var gold = GetGold();
  var i = GetHeroById(-1);
  var chiefgold = GetHeroGold(i)
    ac = GetHeroGold(i+1);
    if((chiefgold / 10) > ac)
    {
      if(ac < gold)
      {
        if((ac * 2000000) < (chiefgold / 10))
        {
          if((ac * 2000000) < gold)
          {
            DelayHeroBuy(200,i+1);
            return;
          }
        }
        else if((ac * 1000) < (chiefgold / 10))
        {
          if((ac * 1000) < gold)
          {
            DelayHeroBuy(100,i+1);
            return;
          }
        }
        DelayHeroBuy(25,i+1);
        return
      }
    }
    for(var j = i + 2; j < heroeslength;j++)
    {
      var div = j - i - 1 * 100;
      if(div > 1000) div = 1000;
      ac = GetHeroGold(j);
      if(chiefgold / div > ac)
      {
        if(ac < gold)
        {
          if((ac * 2000000) < (chiefgold / div))
          {
            if((ac * 2000000) < gold)
            {
              DelayHeroBuy(200,j);
              return;
            }
          }
          else if((ac * 1000) < (chiefgold / div))
          {
            if((ac * 1000) < gold)
            {
              DelayHeroBuy(100,j);
              return;
            }
          }
          DelayHeroBuy(25,j);
          return;
        }
      }
    }
}

function FreeBuy()
{
  var min = 0;
  var mingold = 0;
  SelectBuy(25);
  var gold = GetGold();
  for(var i = GetHeroById(-1); i < heroeslength;i++)
  {
    var ac = GetHeroGold(i);
    if(ac < gold)
    {
      if(ac < mingold || mingold == 0)
      {
        min = i;
        mingold = ac;
      }
    }
  }
  if(min == 0)
  {
    DelayReborn();
    freebuy = 2;
    return;
  }
  var sbuy = 25;
  if((mingold * 100000) < gold)
  {
    sbuy = 100;
  }
  if((mingold * 200000000) < gold)
  {
    sbuy = 200;
  }
  DelayHeroBuy(sbuy,min);
}

function AutoReborn()
{
  SelectBuy(25);
  var av = 0;
  for(var i = GetHeroById(-1); i < heroeslength; i++)
  {
    if(GetHeroGold(i) < lvllimit)
    {
      av++;
      if(CheckBuy(25,i))
      {
        DelayHeroBuy(25,i);
        return;
      }
    }
  }
  if(av == 0 && reborning == 1) 
  {
    freebuy = 1;
    reborning = 2;
  }
}

function Reborn()
{
  var quests = document.getElementsByClassName("quests")[0];
  for(var i = 0; i < quests.childElementCount; i++)
  {
    if(quests.children[i].childNodes[0].currentSrc.indexOf("reborn") != -1)
    {
      reborning = 0;
      reborns++;
      quests.children[i].click();
      rebornscreen1 = 1;
    }
  }
}

function RebornScreen(n)
{
  if(n == 1)
  {
    var yesbtn = document.getElementsByClassName("btn-box-2");
    if(yesbtn.length == 0) return;
    yesbtn[0].click();
    rebornscreen2 = 1;
    rebornscreen1 = 0;
  }
  if(n == 2)
  {
    var okbtn = document.getElementsByClassName("btn-simple-green btn-ok");
    if(okbtn.length == 0) return;
    okbtn[0].click();
    rebornscreen2 = 0;
    refresh = 1;
  }
}

function AutoBoss()
{
  var bossbtn = BossUnlocked();
  if(bossbtn == 0) return;
  var hp = GetBossHP();
  var dps = GetDPS();
  if((dps * 29) > hp)
  {
    bossbtn[0].click();
  }
}

function GetDPS()
{
  var aux = document.getElementsByClassName("dps-dpc-panel");
  if(aux.length > 0)
  {
    return ParseGold(aux[0].childNodes[1].childNodes[0].childNodes[0].data);
  }
  return 0;
}

function GetBossHP()
{
  var lvl = GetBossLevel();
  if(lvl == 0) return 0;
  var hp = GetStageHP();
  switch(lvl[lvl.length-1] % 5)
  {
    case 0:
      return hp;
    case 1:
      hp *= 1.6;
    case 2:
      hp *= 1.6;
    case 3:
      hp *= 1.6
    case 4:
      hp *= 1.6;
  }
  return hp * 10;
}

function GetStageHP()
{
  var aux = document.getElementsByClassName("to");
  if(aux.length > 0)
  {
    return ParseGold(aux[0].childNodes[0].data);
  }
  return 0;
}

function BossUnlocked()
{
  var bossbtn = document.getElementsByClassName("boss-txt");
  if(bossbtn.length == 0) return 0;
  return bossbtn;
}

function ClickRange()//Check if stage is under clicklimit
{
  var bosslvl = GetBossLevel();
  if(bosslvl == 0) return false;
  return (GetBossLevel() <= clicklimit);
}

function GetBossLevel()//return boss level
{
  var aux = document.getElementsByClassName("boss-lvl");
  if(aux.length > 0)
  {
    return parseInt(aux[0].childNodes[2].childNodes[0].data);
  }
  return 0;
}

function AbilScreen()
{
  var abils = document.getElementsByClassName("abil locked");
  for(var i = 0;i < abils.length;i++)
  {
    if(CheckAbil(abils[i]))
    {
      DelayAbilBuy(abils[i]);
      break;
    }
  }
  if(i == abils.length)
  {
    abilscreen = 0;
    document.getElementsByClassName("btn-close-x")[0].click();
  }
}

function AutoAbil()
{
    if(unlockedheroes == 0) return;
    if(heroes == null || heroes[0] == null) return;
    for(var j = GetHeroById(-1); j < heroeslength; j++)
    {
      var abil = heroes[j].childNodes[1];
      if(abil.data == null)
      {
        if(abil.className.indexOf("disable") != -1) continue;
        if(abil.className.indexOf("ready") == -1) continue;
        abil.click();
        abilscreen = 1;
        return;
      }
    }
}

function AutoBuy()
{
  if(heroes == null || heroes[0] == null) return;
  if(unlockedheroes == 0) 
    {
      if(CheckBuy(10,heroeslength-1))
      {
        DelayHeroUnlock(heroeslength-1);
      }
    }
    else
    {
      var i = GetHeroById(-1);
      if(GetHeroLevel(i) < 10)
      {
        if(CheckBuy(10,i))
        DelayHeroBuy(10,i);
      }
      else if(GetHeroLevel(i) <= 15)
      {
        if(CheckBuy(10,i))
        DelayHeroBuy(10,i);
      }
      else if(GetHeroLevel(i) < 25)
      {
        if(CheckBuy(1,i))
        DelayHeroBuy(1,i);
      }
      else
      {
        if(i-1 == 0)
        {
          progressbuy = 1;
          return;
        }
        if(CheckBuy(10,i-1))
        {
          DelayHeroUnlock(i-1);
        }
      }
    }
}

function UpdateHeroes()//update heroes info
{
  var aux = document.getElementsByClassName("hero-card");
  if(aux.length == 0) return;
  heroes = aux;
  heroeslength = heroes.length - 2;
  for(unlockedheroes = 0; unlockedheroes < heroeslength; unlockedheroes++)
  {
    if(heroes[unlockedheroes].childNodes.length < 6)
    {
      continue;
    }
    break;
  }
  unlockedheroes = heroeslength - unlockedheroes;
}

function GetHeroById(id)//get heroes index of hero id
{
  if(id == -1) return heroeslength - unlockedheroes;
  return heroeslength - id;
}
  
function CheckAbil(abil)//check if ability is buyable
{
  var abilgold = GetAbilGold(abil);
  return (abilgold < GetGold() && abilgold >= 0);
}

function AbilBuy(abil)//buy ability
{
  abil.childNodes[3].click();
}

function GetAbilGold(abil)//get price of given ability
{
  var abildata = abil.childNodes[3].childNodes[0].childNodes[0].data;
  if(abildata.indexOf("Level") == -1)
  {
    return ParseGold(abil.childNodes[3].childNodes[0].childNodes[0].data);
  }
  return -1;
}

function CheckBuy(x, i)//check if x of given hero is buyable
{
  SelectBuy(x);
  return (GetHeroGold(i) < GetGold());
}
  
function HeroUnlock(i)//unlock locked hero
{
  heroes[i].childNodes[4].click();
}

function SelectBuy(x)//click buy x button
{
  var aux = document.getElementsByClassName("all-x2-panel-box");
  if(aux.length == 0) return;
  var buyx = aux[0].childNodes;
  switch(x)
  {
    case 1:
      buyx[0].click();
      break;
    case 10:
      buyx[1].click();
      break;
    case 25:
      buyx[2].click();
      break;
    case 100:
      buyx[3].click();
      break;
    case 200:
      buyx[4].click();
      break;
  }
}

function HeroBuy(x, i)//buy x amount of a hero
{
  SelectBuy(x);
  heroes[i].childNodes[5].click();
}

function GetGold()//get account gold
{
  var aux = document.getElementsByClassName("res gold");
  if(aux.length == 0) return 0;
  return ParseGold(aux[0].childNodes[0].childNodes[0].data);
}

function ParseGold(goldt)//parse gold string
{
  var gold = 0.0;
  var i = 0;
  var div = 0;
  var notation = "";
  for(i = 0; i < goldt.length; i++)
  {
    if(goldt[i] < '0' || goldt[i] > '9')
    {
      if(goldt[i] == '.')
      {
        div = 1;
      }
      else
      {
        for(var j = i; j < goldt.length; j++)
        {
          notation += goldt[j];
        }
        break;
      }
    }
    else
    {
      gold *= 10;
      gold += parseFloat(goldt[i]);
      if(div > 0) div *= 10;
    }
  }
  switch(notation)
  {
    case 'KD1':
      gold *= 1000
    case 'D':
      gold *= 1000
    case 'U':
      gold *= 1000
    case 'd':
      gold *= 1000
    case 'N':
      gold *= 1000
    case 'O':
      gold *= 1000;
    case 'S':
      gold *= 1000;
    case 's':
      gold *= 1000;
    case 'Q':
      gold *= 1000;
    case 'q':
      gold *= 1000;
    case 'T':
      gold *= 1000;
    case 'B':
      gold *= 1000;
    case 'M':
      gold *= 1000;
    case 'K':
      gold *= 1000;
      break;
  }
  if(div > 0) gold /= div;
  return gold;
}
  
function GetHeroGold(i)//get price of buying hero
{
  var child = heroes[i].childNodes;
  return ParseGold(child[child.length-1].childNodes[0].childNodes[0].data);
}
  
function GetHeroLevel(i)//get level of a hero
{
  return parseInt(heroes[i].childNodes[4].childNodes[0].childNodes[0].data);
}

timedelayscript = setTimeout(DelayScript,delay);
