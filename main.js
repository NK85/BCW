function main()
{
  
  
function HeroUnlock(hero)
{
  hero.childNodes[4].click();
}

function HeroBuy(x, hero)
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
  hero.childNodes[5].click();
}

function GetGold()
{
  var goldt = document.getElementsByClassName("res gold")[0].childNodes[0].childNodes[0].data;
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

//document.getElementsByClassName("hero-card")[4].childNodes[5].click()
