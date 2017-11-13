module.exports =  {

    isUserEnabled: function (username) {
        switch (username) {
            case 'hardcorewithin':
            case 'ulapoppy':
            case 'carlo_colombo':
                return true;
            default:
                return false;
        }
    },

    getDate: () => {
        const date = new Date();
        const date_info = {
            day: date.getDate(),
            month: date.getMonth(),
            year: date.getFullYear()
        }
        return date_info;
    },

    isZodiacSign: function(name){
        return  ['leone', 'bilancia', 'ariete', 'cancro', 'sagittario', 'gemelli', 'scorpione', 'pesci', 'vergine', 'acquario', 'toro', 'capricorno']
                .includes(name);
    }
}