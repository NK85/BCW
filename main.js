var wait = 0;
var heroes;
var unlockedheroes;
var heroeslength;
var autobuy = 1;
var autoabil = 1;
var autoreborn = 1;
var rebornlvl = 45;
var abilscreen = 0;
var lvllimit = ParseGold("100B");
var autoclick = 1;
var clicklimit = 2;
var loopinterval = 417;
var calls = 0;
var delay = 2000;

//document.getElementsByClassName("boss-txt")[0].click()
//

function DelayScript()//delay start of script
{
  setInterval(bot,loopinterval);
}

function Random(min,max)//random int
{
  return Math.floor((Math.random() * (max-min+1))+min);
}

function bot()//loop through features
{
  calls++;
  if(calls > 1)
  {
    calls--;
    return;
  }
  if(autoclick && ClickRange())
  {
    document.title = "CLICK";
    calls--;
    return;
  }
  document.title = "FT"
  if(abilscreen && autoabil)
  {
    AbilScreen();
    calls--;
    return;
  }
}

function ClickRange()//Check if stage is under clicklimit
{
  return (GetBossLevel() <= clicklimit);
}

function GetBossLevel()//return boss level
{
  return parseInt(document.getElementsByClassName("boss-lvl")[0].childNodes[2].childNodes[0].data);
}

function AbilScreen()
{
  var abils = document.getElementsByClassName("abil locked");
  for(i = 0;i < abils.length;i++)
  {
    if(CheckAbil(abils[i]))
    {
      setTimeout(AbilBuy,Random(300,600),abils[i]);
      break;
    }
  }
  if(i == abils.length)
  {
    abilscreen = 0;
    document.getElementsByClassName("btn-close-x")[0].click();
  }
  UpdateHeroes();
  if(autobuy) AutoBuy();
  if(autoabil) AutoAbil();
  calls--;
}

function AutoAbil()
{
    if(unlockedheroes == 0) return;
    for(j = GetHeroById(-1); j < heroeslength; j++)
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
  if(unlockedheroes == 0) 
    {
      if(CheckBuy(10,heroes[heroeslength-1]))
      {setTimeout(HeroUnlock,Random(300,600),heroes[heroeslength-1]);}
    }
    else
    {
      var i = GetHeroById(-1);
      if(GetHeroLevel(heroes[i]) < 10)
      {
        if(CheckBuy(10,heroes[i]))
        {setTimeout(HeroBuy,Random(300,600),10,heroes[i]);}
        //todo: upgrades
      }
      else if(GetHeroLevel(heroes[i]) <= 15)
      {
        if(CheckBuy(10,heroes[i]))
        {setTimeout(HeroBuy,Random(300,600),10,heroes[i]);}
      }
      else if(GetHeroLevel(heroes[i]) < 25)
      {
        if(CheckBuy(1,heroes[i]))
        {setTimeout(HeroBuy,Random(300,600),1,heroes[i]);}
      }
      else
      {
        if(CheckBuy(10,heroes[i-1]))
        {setTimeout(HeroUnlock,Random(300,600),heroes[i-1]);}
      }
    }
}

function UpdateHeroes()//update heroes info
{
  heroes = document.getElementsByClassName("hero-card");
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

function CheckBuy(x, hero)//check if x of given hero is buyable
{
  SelectBuy(x);
  return (GetHeroGold(hero) < GetGold());
}
  
function HeroUnlock(hero)//unlock locked hero
{
  hero.childNodes[4].click();
}

function SelectBuy(x)//click buy x button
{
  var buyx = document.getElementsByClassName("all-x2-panel-box")[0].childNodes;
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
  }
}

function HeroBuy(x, hero)//buy x amount of a hero
{
  SelectBuy(x);
  hero.childNodes[5].click();
}

function GetGold()//get account gold
{
  return ParseGold(document.getElementsByClassName("res gold")[0].childNodes[0].childNodes[0].data);
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
        for(j = i; j < goldt.length; j++)
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
  
function GetHeroGold(hero)//get price of buying hero
{
  var child = hero.childNodes;
  return ParseGold(child[child.length-1].childNodes[0].childNodes[0].data);
}
  
function GetHeroLevel(hero)//get level of a hero
{
  return parseInt(hero.childNodes[4].childNodes[0].childNodes[0].data);
}

setTimeout(DelayScript,3000);
