/**
 * Форматирует дату в относительное время (например, "5 минут назад")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'только что';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${getDeclension(diffInMinutes, 'минуту', 'минуты', 'минут')} назад`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${getDeclension(diffInHours, 'час', 'часа', 'часов')} назад`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${getDeclension(diffInDays, 'день', 'дня', 'дней')} назад`;
  }
  
  // Если больше недели, показываем дату
  return formatDate(date);
}

/**
 * Форматирует дату в формате ДД.ММ.ГГГГ
 */
export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}.${month}.${year}`;
}

/**
 * Форматирует дату и время в формате ДД.ММ.ГГГГ ЧЧ:ММ
 */
export function formatDateTime(date: Date): string {
  const formattedDate = formatDate(date);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${formattedDate} ${hours}:${minutes}`;
}

/**
 * Возвращает правильное склонение слова в зависимости от числа
 */
function getDeclension(number: number, one: string, few: string, many: string): string {
  if (number % 10 === 1 && number % 100 !== 11) {
    return one;
  } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
    return few;
  } else {
    return many;
  }
} 