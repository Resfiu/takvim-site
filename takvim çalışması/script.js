// LocalStorage'dan görevleri yükle
let tasks = JSON.parse(localStorage.getItem('weeklyTasks')) || [];
let currentView = 'weekly';
let currentMonth = new Date();

// DOM elementleri
const taskForm = document.getElementById('taskForm');
const calendar = document.getElementById('calendar');
const filterButtons = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const weeklyHoursEl = document.getElementById('weeklyHours');
const viewButtons = document.querySelectorAll('.view-btn');
const weeklyView = document.getElementById('weeklyView');
const monthlyView = document.getElementById('monthlyView');
const monthlyNav = document.getElementById('monthlyNav');
const monthlyCalendar = document.getElementById('monthlyCalendar');
const currentMonthEl = document.getElementById('currentMonth');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// Sayfa yüklendiğinde görevleri göster
document.addEventListener('DOMContentLoaded', () => {
    displayTasks();
    updateStats();
    setupViewToggle();
    setupMonthNavigation();
    setupTabs();
    setupFileImport();
});

// Form gönderimi
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        day: document.getElementById('day').value,
        subject: document.getElementById('subject').value,
        time: document.getElementById('time').value,
        duration: parseInt(document.getElementById('duration').value),
        platform: document.getElementById('platform').value,
        description: document.getElementById('description').value,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(task);
    saveTasks();
    displayTasks();
    updateStats();
    taskForm.reset();
    
    // Başarı mesajı
    showNotification('✅ Çalışma başarıyla eklendi!');
});

// Görevleri göster
function displayTasks(filterDay = 'all') {
    const filteredTasks = filterDay === 'all' 
        ? tasks 
        : tasks.filter(task => task.day === filterDay);
    
    if (filteredTasks.length === 0) {
        calendar.innerHTML = `
            <div class="empty-state">
                <div class="emoji">📅</div>
                <p>Henüz çalışma eklenmemiş</p>
                <p style="font-size: 0.9em; color: #aaa;">Yukarıdaki formu kullanarak yeni çalışma ekleyin</p>
            </div>
        `;
        return;
    }
    
    // Günlere göre sırala
    const dayOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    filteredTasks.sort((a, b) => {
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return a.time.localeCompare(b.time);
    });
    
    calendar.innerHTML = filteredTasks.map(task => `
        <div class="task-card ${task.completed ? 'completed' : ''}" data-id="${task.id}">
            <span class="task-day">${task.day}</span>
            <div class="task-subject">${task.subject}</div>
            
            <div class="task-info">
                <div class="task-info-item">
                    <strong>🕐 Saat:</strong> ${task.time}
                </div>
                <div class="task-info-item">
                    <strong>⏱️ Süre:</strong> ${task.duration} dakika
                </div>
                ${task.platform ? `
                    <div class="task-info-item">
                        <strong>📍 Yer:</strong> ${task.platform}
                    </div>
                ` : ''}
            </div>
            
            ${task.description ? `
                <div class="task-description">
                    ${task.description}
                </div>
            ` : ''}
            
            <div class="task-actions">
                <button class="btn-complete" onclick="toggleComplete(${task.id})">
                    ${task.completed ? '↩️ Geri Al' : '✓ Tamamla'}
                </button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">
                    🗑️ Sil
                </button>
            </div>
        </div>
    `).join('');
}

// Görev tamamla/geri al
function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        displayTasks();
        updateStats();
        showNotification(task.completed ? '✅ Çalışma tamamlandı!' : '↩️ Çalışma geri alındı');
    }
}

// Görev sil
function deleteTask(id) {
    if (confirm('Bu çalışmayı silmek istediğinizden emin misiniz?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        displayTasks();
        updateStats();
        showNotification('🗑️ Çalışma silindi');
    }
}

// Filtreleme butonları
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterDay = btn.getAttribute('data-day');
        displayTasks(filterDay);
    });
});

// İstatistikleri güncelle
function updateStats() {
    totalTasksEl.textContent = tasks.length;
    
    const totalMinutes = tasks.reduce((sum, task) => sum + task.duration, 0);
    const totalHours = (totalMinutes / 60).toFixed(1);
    weeklyHoursEl.textContent = `${totalHours} saat`;
}

// LocalStorage'a kaydet
function saveTasks() {
    localStorage.setItem('weeklyTasks', JSON.stringify(tasks));
}

// Bildirim göster
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Görünüm değiştirme
function setupViewToggle() {
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.getAttribute('data-view');
            
            if (currentView === 'weekly') {
                weeklyView.style.display = 'block';
                monthlyView.style.display = 'none';
                monthlyNav.style.display = 'none';
            } else {
                weeklyView.style.display = 'none';
                monthlyView.style.display = 'block';
                monthlyNav.style.display = 'flex';
                renderMonthlyCalendar();
            }
        });
    });
}

// Ay navigasyonu
function setupMonthNavigation() {
    prevMonthBtn.addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
        renderMonthlyCalendar();
    });
    
    nextMonthBtn.addEventListener('click', () => {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
        renderMonthlyCalendar();
    });
}

// Aylık takvim oluştur
function renderMonthlyCalendar() {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Ay adını göster
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 
                        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    currentMonthEl.textContent = `${monthNames[month]} ${year}`;
    
    // İlk gün ve toplam gün sayısı
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Pazar
    
    // Önceki ayın son günleri
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    let html = '';
    
    // Gün başlıkları
    const dayHeaders = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
    dayHeaders.forEach(day => {
        html += `<div class="month-day-header">${day}</div>`;
    });
    
    // Önceki ayın günleri
    for (let i = prevMonthDays; i > 0; i--) {
        const day = prevMonthLastDay - i + 1;
        html += `<div class="month-day other-month">
            <div class="day-number">${day}</div>
        </div>`;
    }
    
    // Bu ayın günleri
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(year, month, day);
        const dayOfWeek = currentDate.getDay();
        const dayName = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][dayOfWeek];
        
        // Bu güne ait görevleri bul
        const dayTasks = tasks.filter(task => task.day === dayName);
        
        const isToday = today.getDate() === day && 
                       today.getMonth() === month && 
                       today.getFullYear() === year;
        
        html += `<div class="month-day ${isToday ? 'today' : ''}" data-date="${year}-${month+1}-${day}">
            <div class="day-number">${day}</div>
            ${dayTasks.length > 0 ? `<div class="task-count">${dayTasks.length}</div>` : ''}
            <div class="day-tasks">
                ${dayTasks.slice(0, 3).map(task => `
                    <div class="mini-task ${task.completed ? 'completed' : ''}" 
                         onclick="showTaskDetail(${task.id})"
                         title="${task.subject} - ${task.time}">
                        ${task.time} ${task.subject}
                    </div>
                `).join('')}
                ${dayTasks.length > 3 ? `<div class="mini-task" style="background: #667eea; color: white;">+${dayTasks.length - 3} daha</div>` : ''}
            </div>
        </div>`;
    }
    
    // Sonraki ayın günleri
    const totalCells = prevMonthDays + daysInMonth;
    const remainingCells = 42 - totalCells; // 6 hafta x 7 gün = 42
    for (let day = 1; day <= remainingCells; day++) {
        html += `<div class="month-day other-month">
            <div class="day-number">${day}</div>
        </div>`;
    }
    
    monthlyCalendar.innerHTML = html;
}

// Görev detayını göster
function showTaskDetail(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    const detail = `
        📚 ${task.subject}
        
        📅 Gün: ${task.day}
        🕐 Saat: ${task.time}
        ⏱️ Süre: ${task.duration} dakika
        ${task.platform ? `📍 Yer: ${task.platform}` : ''}
        ${task.description ? `\n📝 ${task.description}` : ''}
        
        Durum: ${task.completed ? '✅ Tamamlandı' : '⏳ Bekliyor'}
    `;
    
    if (confirm(detail + '\n\nBu çalışmayı tamamlamak ister misiniz?')) {
        toggleComplete(id);
        if (currentView === 'monthly') {
            renderMonthlyCalendar();
        }
    }
}

// Tab sistemi
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Tüm butonları pasif yap
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Tüm içerikleri gizle
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Seçili sekmeyi göster
            const targetContent = document.getElementById(targetTab + 'Tab');
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
}

// Dosya içe aktarma
function setupFileImport() {
    const fileInput = document.getElementById('excelFile');
    const importBtn = document.getElementById('importBtn');
    const fileNameDisplay = document.getElementById('fileName');
    
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = `📄 ${file.name}`;
            importBtn.style.display = 'block';
        }
    });
    
    importBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (!file) {
            showNotification('⚠️ Lütfen bir dosya seçin!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                
                importFromExcel(jsonData);
            } catch (error) {
                showNotification('❌ Dosya okunamadı! Lütfen geçerli bir Excel/CSV dosyası seçin.');
                console.error(error);
            }
        };
        reader.readAsArrayBuffer(file);
    });
}

// Excel'den veri içe aktar
function importFromExcel(data) {
    let importedCount = 0;
    let errorCount = 0;
    
    data.forEach((row, index) => {
        try {
            // Sütun adlarını normalize et (büyük/küçük harf duyarsız)
            const normalizedRow = {};
            Object.keys(row).forEach(key => {
                normalizedRow[key.toLowerCase().trim()] = row[key];
            });
            
            // Gerekli alanları kontrol et
            const day = normalizedRow['gün'] || normalizedRow['gun'];
            const subject = normalizedRow['ders/konu'] || normalizedRow['ders'] || normalizedRow['konu'];
            const time = normalizedRow['saat'];
            const duration = normalizedRow['süre'] || normalizedRow['sure'];
            
            if (!day || !subject || !time || !duration) {
                errorCount++;
                return;
            }
            
            // Saati formatla (eğer Excel saat formatındaysa)
            let formattedTime = time;
            if (typeof time === 'number') {
                const hours = Math.floor(time * 24);
                const minutes = Math.floor((time * 24 - hours) * 60);
                formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
            } else if (time.toString().includes(':')) {
                formattedTime = time.toString().substring(0, 5);
            }
            
            const task = {
                id: Date.now() + index,
                day: day.toString().trim(),
                subject: subject.toString().trim(),
                time: formattedTime,
                duration: parseInt(duration),
                platform: normalizedRow['platform'] || normalizedRow['yer'] || '',
                description: normalizedRow['açıklama'] || normalizedRow['aciklama'] || '',
                completed: false,
                createdAt: new Date().toISOString()
            };
            
            tasks.push(task);
            importedCount++;
        } catch (error) {
            errorCount++;
            console.error('Satır işlenirken hata:', index, error);
        }
    });
    
    if (importedCount > 0) {
        saveTasks();
        displayTasks();
        updateStats();
        showNotification(`✅ ${importedCount} çalışma başarıyla içe aktarıldı!${errorCount > 0 ? ` (${errorCount} hata)` : ''}`);
        
        // Formu temizle
        document.getElementById('excelFile').value = '';
        document.getElementById('fileName').textContent = '';
        document.getElementById('importBtn').style.display = 'none';
    } else {
        showNotification('❌ Hiçbir veri içe aktarılamadı! Dosya formatını kontrol edin.');
    }
}

// Excel'e dışa aktar
function exportToExcel() {
    if (tasks.length === 0) {
        showNotification('⚠️ Dışa aktarılacak çalışma yok!');
        return;
    }
    
    const exportData = tasks.map(task => ({
        'Gün': task.day,
        'Ders/Konu': task.subject,
        'Saat': task.time,
        'Süre': task.duration,
        'Platform': task.platform || '',
        'Açıklama': task.description || '',
        'Durum': task.completed ? 'Tamamlandı' : 'Bekliyor',
        'Oluşturulma': new Date(task.createdAt).toLocaleDateString('tr-TR')
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Çalışma Takvimi');
    
    // Sütun genişliklerini ayarla
    worksheet['!cols'] = [
        { wch: 12 },  // Gün
        { wch: 25 },  // Ders/Konu
        { wch: 10 },  // Saat
        { wch: 10 },  // Süre
        { wch: 20 },  // Platform
        { wch: 40 },  // Açıklama
        { wch: 12 },  // Durum
        { wch: 15 }   // Oluşturulma
    ];
    
    XLSX.writeFile(workbook, `Calisma_Takvimi_${new Date().toISOString().slice(0,10)}.xlsx`);
    showNotification('📊 Excel dosyası indirildi!');
}

// CSV'ye dışa aktar
function exportToCSV() {
    if (tasks.length === 0) {
        showNotification('⚠️ Dışa aktarılacak çalışma yok!');
        return;
    }
    
    const headers = ['Gün', 'Ders/Konu', 'Saat', 'Süre', 'Platform', 'Açıklama', 'Durum'];
    const csvRows = [headers.join(',')];
    
    tasks.forEach(task => {
        const row = [
            task.day,
            `"${task.subject}"`,
            task.time,
            task.duration,
            `"${task.platform || ''}"`,
            `"${task.description || ''}"`,
            task.completed ? 'Tamamlandı' : 'Bekliyor'
        ];
        csvRows.push(row.join(','));
    });
    
    const csvContent = '\uFEFF' + csvRows.join('\n'); // UTF-8 BOM ekle
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Calisma_Takvimi_${new Date().toISOString().slice(0,10)}.csv`;
    link.click();
    
    showNotification('📄 CSV dosyası indirildi!');
}

// Şablon indir
function downloadTemplate() {
    const templateData = [
        {
            'Gün': 'Pazartesi',
            'Ders/Konu': 'Matematik',
            'Saat': '14:00',
            'Süre': 60,
            'Platform': 'Evde',
            'Açıklama': 'Cebir çalışması'
        },
        {
            'Gün': 'Salı',
            'Ders/Konu': 'Fizik',
            'Saat': '15:30',
            'Süre': 90,
            'Platform': 'Kütüphane',
            'Açıklama': 'Dinamik problemleri'
        },
        {
            'Gün': 'Çarşamba',
            'Ders/Konu': 'Kimya',
            'Saat': '10:00',
            'Süre': 45,
            'Platform': 'Online',
            'Açıklama': ''
        }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Örnek');
    
    // Sütun genişlikleri
    worksheet['!cols'] = [
        { wch: 12 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
        { wch: 20 },
        { wch: 40 }
    ];
    
    XLSX.writeFile(workbook, 'Calisma_Takvimi_Sablon.xlsx');
    showNotification('📥 Şablon dosyası indirildi!');
}

// Yazdır
function printSchedule() {
    if (tasks.length === 0) {
        showNotification('⚠️ Yazdırılacak çalışma yok!');
        return;
    }
    
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Çalışma Takvimi</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #667eea; text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #667eea; color: white; }
        tr:nth-child(even) { background-color: #f5f7fa; }
        .completed { opacity: 0.6; text-decoration: line-through; }
        @media print { button { display: none; } }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>📚 Haftalık Çalışma Takvimi</h1>');
    printWindow.document.write('<p style="text-align: center;">Tarih: ' + new Date().toLocaleDateString('tr-TR') + '</p>');
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Gün</th><th>Ders/Konu</th><th>Saat</th><th>Süre</th><th>Platform</th><th>Açıklama</th><th>Durum</th></tr>');
    
    const dayOrder = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    const sortedTasks = [...tasks].sort((a, b) => {
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return a.time.localeCompare(b.time);
    });
    
    sortedTasks.forEach(task => {
        printWindow.document.write(`
            <tr class="${task.completed ? 'completed' : ''}">
                <td>${task.day}</td>
                <td>${task.subject}</td>
                <td>${task.time}</td>
                <td>${task.duration} dk</td>
                <td>${task.platform || '-'}</td>
                <td>${task.description || '-'}</td>
                <td>${task.completed ? '✅ Tamamlandı' : '⏳ Bekliyor'}</td>
            </tr>
        `);
    });
    
    printWindow.document.write('</table>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

// CSS animasyonları
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
