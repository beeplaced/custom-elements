export const months =
{
    'de': [
        "Januar",
        "Februar",
        "März",
        "April",
        "Mai",
        "Juni",
        "Juli",
        "August",
        "September",
        "Oktober",
        "November",
        "Dezember",
    ],
    'en': [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]
}

export const weekDays =
{
    'de': [
        "Montag",
        "Dienstag",
        "Mittwoch",
        "Donnerstag",
        "Freitag",
        "Samstag",
        "Sonntag",
    ],
    'en': [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SON",
    ]
}

export const today = new Date();
export const currentMonth = today.getMonth();
export const currentYear = today.getFullYear();
export const currentDay = today.getDate();
export const startYear = currentYear - 10;
export const endYear = currentYear + 10;