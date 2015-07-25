var allRaces = {};
allRaces['1'] = ['Humain', 'Humaine'];
allRaces['2'] = ['Orc', 'Orque'];
allRaces['3'] = ['Nain', 'Naine'];
allRaces['4'] = ['Elfe de la nuit', 'Elfe de la nuit'];
allRaces['5'] = ['Mort-vivant', 'Morte-vivante'];
allRaces['6'] = ['Tauren', 'Taurène'];
allRaces['7'] = ['Gnome', 'Gnome'];
allRaces['8'] = ['Troll', 'Trollesse'];
allRaces['9'] = ['Gobelin', 'Gobeline'];
allRaces['10'] = ['Elfe de sang', 'Elfe de sang'];
allRaces['11'] = ['Draeneï', 'Draeneï'];
allRaces['22'] = ['Worgen', 'Worgen'];
allRaces['24'] = ['Pandaren neutre', 'Pandarène neutre']
allRaces['25'] = ['Pandaren de l\'Alliance', 'Pandarène de l\'Alliance'];
allRaces['26'] = ['Pandaren de la Horde', 'Pandarène de la Horde'];

sras.filter('race', function(){
    return function(input, gender)
    {
        if(Number(input) === NaN)
            return "Autre";
        if(allRaces.hasOwnProperty(input) == false)
            return "Autre";

        var gender_num = Number(gender);
        if(gender_num ==! 1)
            gender_num = 0;

        return allRaces[input][gender];
    }
});

var allClasses = {};
allClasses['1'] = ['Guerrier', 'Guerrière'];
allClasses['2'] = ['Paladin', 'Paladin'];
allClasses['3'] = ['Chasseur', 'Chasseresse'];
allClasses['4'] = ['Voleur', 'Voleuse'];
allClasses['5'] = ['Prêtre', 'Prêtresse'];
allClasses['6'] = ['Chevalier de la mort', 'Chevalier de la mort'];
allClasses['7'] = ['Chaman', 'Chamane'];
allClasses['8'] = ['Mage', 'Mage'];
allClasses['9'] = ['Démoniste', 'Démoniste'];
allClasses['10'] = ['Moine', 'Moniale'];
allClasses['11'] = ['Druide', 'Druidesse'];

sras.filter('class', function(){
    return function(input, gender)
    {
        if(Number(input) === NaN)
            return "Autre";
        if(allRaces.hasOwnProperty(input) == false)
            return "Autre";

        var gender_num = Number(gender);
        if(gender_num ==! 1)
            gender_num = 0;

        return allClasses[input][gender];
    }
});

sras.filter('duration', function(){
    return function(input){
        var hour = Math.trunc(input/3600);
        var reste = input % 3600;
        var minute = Math.trunc(reste/60);
        var seconde = reste % 60;

        return hour + 'h ' + minute + 'm ' + seconde + 's';
    }
});

sras.filter('money', function(){
    return function(input){
        var gold = Math.trunc(input/(100*100));
        var reste = input % (100*100);
        var argent = Math.trunc(reste / 100);
        var cuivre = reste % 100;

        return gold + ' or ' + argent + ' argent ' + cuivre + ' cuivre';
    }
});

sras.filter('wowheadSkill', function()
{
    return function(input, id){
        return '<a href="#" rel="skill=' + id + '">' + input + '</a>'
    }
})
