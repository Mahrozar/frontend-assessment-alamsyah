/**
 * Menghitung frekuensi huruf tanpa mengubah teks asli.
 * Mendukung huruf Unicode dan mengabaikan spasi, tanda baca, serta angka.
 *
 * @param {string} text
 * @returns {Record<string, number>}
 */
export function countCharacterFrequency(text) {
  if (typeof text !== 'string') return {};

  return [...text.toLocaleLowerCase()].reduce((frequency, character) => {
    if (/\p{L}/u.test(character)) {
      frequency[character] = (frequency[character] ?? 0) + 1;
    }
    return frequency;
  }, {});
}

/**
 * Menyaring pengguna dewasa, mengelompokkannya berdasarkan gender yang
 * dinormalisasi, lalu menghitung rata-rata usia tiap kelompok. Data yang
 * tidak valid atau tidak lengkap akan dilewati.
 *
 * @param {Array<{id?: unknown, name?: unknown, age?: unknown, gender?: unknown}>} users
 * @returns {Record<string, {count: number, averageAge: number, users: object[]}>}
 */
export function processUserData(users) {
  if (!Array.isArray(users)) return {};

  const grouped = users.reduce((result, user) => {
    if (!user || typeof user !== 'object') return result;

    const age = typeof user.age === 'number' ? user.age : Number(user.age);
    const gender = typeof user.gender === 'string'
      ? user.gender.trim().toLocaleLowerCase()
      : '';

    if (!Number.isFinite(age) || age < 18 || !gender) return result;

    if (!result[gender]) {
      result[gender] = { count: 0, totalAge: 0, users: [] };
    }

    result[gender].count += 1;
    result[gender].totalAge += age;
    result[gender].users.push({ ...user, age });
    return result;
  }, {});

  return Object.fromEntries(
    Object.entries(grouped).map(([gender, group]) => [
      gender,
      {
        count: group.count,
        averageAge: Number((group.totalAge / group.count).toFixed(1)),
        users: group.users,
      },
    ]),
  );
}
