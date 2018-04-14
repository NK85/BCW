var wait = 0;
var heroes;
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

//document.getElementsByClassName("boss-txt")[0].click()
//

function Random(min,max)
{
  return Math.floor((Math.random() * (max-min+1))+min);
}

function bot()
{
  main();
}

function main()
{
  calls++;
  if(calls > 1)
  {
    calls--;
    return;
  }
  if(autoclick)
  {
    if(parseInt(document.getElementsByClassName("boss-lvl")[0].childNodes[2].childNodes[0].data) <= clicklimit)
    {
      document.title = "CLICK";
      calls--;
      return;
    }
    document.title = "FT"
  }
  if(abilscreen)
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
    calls--;
    return;
  }
  heroes = document.getElementsByClassName("hero-card");
  var hlength = heroes.length - 2;
  var i;
  for(i = 0; i < hlength; i++)
  {
    if(heroes[i].childNodes.length < 6)
    {
      continue;
    }
    break;
  }
  if(autobuy)
  {
    if(i == hlength) 
    {
      if(CheckBuy(10,heroes[i-1]))
      {setTimeout(HeroUnlock,Random(300,600),heroes[i-1]);}
    }
    else
    {
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
  if(autoabil)
  {
    if(i == hlength) 
    {
      calls--;
      return;
    }
    for(j = i; j < hlength; j++)
    {
      var abil = heroes[j].childNodes[1];
      if(abil.data == null)
      {
        if(abil.className.indexOf("disable") != -1) continue;
        if(abil.className.indexOf("ready") == -1) continue;
        abil.click();
        abilscreen = 1;
        calls--;
        return;
      }
    }
  }
  calls--;
}
  
function CheckAbil(abil)
{
  var abilgold = GetAbilGold(abil);
  return (abilgold < GetGold() && abilgold >= 0);
}

function AbilBuy(abil)
{
  abil.childNodes[3].click();
}

function GetAbilGold(abil)
{
  var abildata = abil.childNodes[3].childNodes[0].childNodes[0].data;
  if(abildata.indexOf("Level") == -1)
  {
    return ParseGold(abil.childNodes[3].childNodes[0].childNodes[0].data);
  }
  return -1;
}

function CheckBuy(x, hero)
{
  SelectBuy(x);
  return (GetHeroGold(hero) < GetGold());
}
  
function WaitToUnlockHero(x, hero)
{
  while(1)
  {
    SelectBuy(x);
    if(GetHeroGold(hero) < GetGold())
    {
      break;
    }
  }
}
  
function HeroUnlock(hero)
{
  hero.childNodes[4].click();
}

function WaitToBuyHero(x, hero)
{
  while(1)
  {
    SelectBuy(x);
    if(GetHeroGold(hero) < GetGold())
    {
      break;
    }
  }
}

function SelectBuy(x)
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

function HeroBuy(x, hero)
{
  SelectBuy(x);
  hero.childNodes[5].click();
}

function GetGold()
{
  return ParseGold(document.getElementsByClassName("res gold")[0].childNodes[0].childNodes[0].data);
}

function ParseGold(goldt)
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
  
function GetHeroGold(hero)
{
  var child = hero.childNodes;
  return ParseGold(child[child.length-1].childNodes[0].childNodes[0].data);
}
  
function GetHeroLevel(hero)
{
  return parseInt(hero.childNodes[4].childNodes[0].childNodes[0].data);
}

var botinterval = setInterval(bot,loopinterval);
