import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(isoWeek);

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
        const baseDate = dayjs(date).utc().startOf("day"); // Convertimos la fecha a UTC y eliminamos la hora
        let nextDate: dayjs.Dayjs;

        const originalDay = baseDate.date(); // Guardamos el día original

        switch (repeat) {
            case "EVERY DAY":
                nextDate = baseDate.add(1, "day");
                break;
            case "EVERY TWO DAYS":
                nextDate = baseDate.add(2, "days");
                break;
            case "EVERY WORKING DAY":
                let currentDay = baseDate.isoWeekday(); // 1 (lunes) a 7 (domingo)
                if (currentDay >= 5) {
                    nextDate = baseDate.isoWeekday(8); // Lunes siguiente
                } else {
                    nextDate = baseDate.add(1, "day");
                }
                break;
            case "EVERY WEEK":
                nextDate = baseDate.add(1, "week");
                break;
            case "EVERY TWO WEEKS":
                nextDate = baseDate.add(2, "weeks");
                break;
            case "EVERY MONTH":
                nextDate = baseDate.add(1, "month").set("date", originalDay);
                break;
            case "EVERY TWO MONTHS":
                nextDate = baseDate.add(2, "months").set("date", originalDay);
                break;
            case "EVERY THREE MONTHS":
                nextDate = baseDate.add(3, "months").set("date", originalDay);
                break;
            case "EVERY SIX MONTHS":
                nextDate = baseDate.add(6, "months").set("date", originalDay);
                break;
            case "EVERY YEAR":
                nextDate = baseDate.add(1, "year").set("date", originalDay);
                break;
            case "NEVER":
                return null;
            default:
                throw new Error(`Invalid repeat value: ${repeat}`);
        }
        if(isTransaction === false){
            nextDate = nextDate.subtract(1, "day"); // Si es una transacción, devuelve el día anterior al siguiente ajustado al principio de día UTC.
        }
        return nextDate.utc().toDate(); // Asegurar UTC y formato Date
    };

}