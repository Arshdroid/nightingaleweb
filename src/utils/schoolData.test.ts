import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ANNOUNCEMENTS,
  BLOCK_D_FACULTY,
  SCHOOL_INFO,
  filterAnnouncements,
  getScheduleForGrade,
  validateInquiryForm,
} from './schoolData';

test('school metadata matches Nightingale International Secondary School Block D', () => {
  assert.equal(SCHOOL_INFO.fullName, 'Nightingale International Secondary School');
  assert.equal(SCHOOL_INFO.address, 'Kopundole, Lalitpur, Nepal');
  assert.equal(SCHOOL_INFO.blockDPhone, '01-5451791');
  assert.equal(SCHOOL_INFO.email, 'school@nightingale.edu.np');
  assert.equal(BLOCK_D_FACULTY.length, 5);
  assert.equal(BLOCK_D_FACULTY[0].name, 'T.L. Chaudhary');
  assert.equal(BLOCK_D_FACULTY[1].name, 'Ranjana Pradhan');
  assert.equal(BLOCK_D_FACULTY[2].name, 'Deepa Thapa');
  assert.equal(BLOCK_D_FACULTY[3].name, 'Meena Ale');
  assert.equal(BLOCK_D_FACULTY[4].name, 'Amandeep Kaur');
});

test('getScheduleForGrade returns summer and winter timings accurately', () => {
  const summer7 = getScheduleForGrade('Grade 7', 'summer');
  const winter7 = getScheduleForGrade('Grade 7', 'winter');
  assert.equal(summer7.length, 10);
  assert.equal(summer7[0].activeTime, '09:30 – 09:45');
  assert.equal(winter7[0].activeTime, '09:45 – 10:00');
  assert.equal(summer7[summer7.length - 1].activeTime, '03:05 – 03:45');
});

test('filterAnnouncements filters by category and search query', () => {
  const scheduleOnly = filterAnnouncements(ANNOUNCEMENTS, 'Schedule', '');
  assert.equal(scheduleOnly.length, 1);
  assert.ok(scheduleOnly.every((item) => item.category === 'Schedule'));

  const weatherSearch = filterAnnouncements(ANNOUNCEMENTS, 'All', 'Weather');
  assert.equal(weatherSearch.length, 1);
  assert.ok(weatherSearch[0].title.includes('Weather'));
});

test('validateInquiryForm validates required student name and phone', () => {
  const invalidName = validateInquiryForm({
    studentName: 'A',
    parentPhone: '015435663',
    gradeApplying: 'Grade 7',
    message: '',
  });
  assert.equal(invalidName.valid, false);

  const invalidPhone = validateInquiryForm({
    studentName: 'Aarav Shrestha',
    parentPhone: '123',
    gradeApplying: 'Grade 8',
    message: '',
  });
  assert.equal(invalidPhone.valid, false);

  const valid = validateInquiryForm({
    studentName: 'Aarav Shrestha',
    parentPhone: '01-5451791',
    gradeApplying: 'Grade 9',
    message: 'Inquiry for Block D admission',
  });
  assert.equal(valid.valid, true);
});
