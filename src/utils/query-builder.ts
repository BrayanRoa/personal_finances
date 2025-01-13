import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';


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

    static switchTransaction = (date: Date, repeat: string, isTransaction: boolean) => {
        let nextDate;
        let nextMonthStart
        switch (repeat) {
            case "EVERY DAY":
                nextDate = dayjs(date).add(1, 'days');
                break;
            case "EVERY TWO DAYS":
                nextDate = dayjs(date).add(2, 'days');
                break;
            case "EVERY WORKING DAY":
                const currentDay = dayjs(date).isoWeekday(); // 1 (lunes) a 7 (domingo)
                nextDate = dayjs(date);
                if (currentDay >= 5) {
                    // Si es viernes o fin de semana, mueve al lunes
                    nextDate = nextDate.isoWeekday(8); // Próximo lunes
                } else {
                    // Día hábil normal
                    nextDate = nextDate.add(1, 'day');
                }
                break;

            case "EVERY WEEK":
                nextMonthStart = dayjs(date).add(1, 'week');
                break;
            case "EVERY TWO WEEKS":
                nextMonthStart = dayjs(date).add(2, 'week');
                break;
            case "EVERY MONTH":
                nextMonthStart = dayjs(date).add(1, 'month');
                break;
            case "EVERY TWO MONTHS":
                nextMonthStart = dayjs(date).add(2, 'month');
                break;
            case "EVERY THREE MONTHS":
                nextMonthStart = dayjs(date).add(3, 'month');
                break;
            case "EVERY SIX MONTHS":
                nextMonthStart = dayjs(date).add(6, 'month');
                break;
            case "EVERY YEAR":
                nextDate = dayjs(date).add(1, 'year').subtract(1, 'day');
                break;
            case "NEVER":
                nextDate = null;
                break;
            default:
                throw new Error(`Invalid repeat value: ${repeat}`);
        }
        if (!isTransaction) {
            nextDate = nextMonthStart!.subtract(1, 'day'); // Último día del mes actual
        }
        return nextDate?.toDate()
    }
}