import moment from "moment";


export class QueryBuilder {

    static calculateMonths = (year: number, months: number[]) => {
        if (months && months.length > 0) {
            return months.map(row => {
                const start = new Date(Date.UTC(year, row - 1, 1));
                const end = new Date(Date.UTC(year, row, 0));  //Al pasar 0 como el tercer parámetro (day), JavaScript interpreta esto como el último día del mes anterior (en este caso, el mes al que pertenece row).
                return { start, end };
            });
        } else {
            const currentDate = new Date();
            const start = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), 1));
            const end = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth() + 1, 0));
            return [{ start, end }];
        }
    };

    static switchTransaction = (date: Date, repeat: string) => {
        let nextDate;
        switch (repeat) {
            case "EVERY DAY":
                nextDate = moment.utc(date).add(1, 'days');
                break;
            case "EVERY TWO DAYS":
                nextDate = moment.utc(date).add(2, 'days');
                break;
            case "EVERY WORKING DAY":
                const currentDay = moment.utc(date).isoWeekday(); // 1 (lunes) a 7 (domingo)
                nextDate = moment.utc(date);
                if (currentDay >= 5) {
                    // Si es viernes o fin de semana, mueve al lunes
                    nextDate = nextDate.isoWeekday(8); // Próximo lunes
                } else {
                    // Día hábil normal
                    nextDate.add(1, 'days');
                }
                break;

            case "EVERY WEEK":
                nextDate = moment.utc(date).add(1, 'weeks');
                break;
            case "EVERY TWO WEEKS":
                nextDate = moment.utc(date).add(2, 'weeks');
                break;
            case "EVERY MONTH":
                nextDate = moment.utc(date).add(1, 'months');
                break;
            case "EVERY TWO MONTHS":
                nextDate = moment.utc(date).add(2, 'months');
                break;
            case "EVERY THREE MONTHS":
                nextDate = moment.utc(date).add(3, 'months');
                break;
            case "EVERY SIX MONTHS":
                nextDate = moment.utc(date).add(6, 'months');
                break;
            case "EVERY YEAR":
                nextDate = moment.utc(date).add(1, 'years');
                break;
            case "NEVER":
                nextDate = null;
                break;
            default:
                throw new Error(`Invalid repeat value: ${repeat}`);
        }

        return nextDate?.toDate()
    }
}