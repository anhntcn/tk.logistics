// KHỞI TẠO SMOOTH SCROLL
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

requestAnimationFrame(raf);

$(document).ready(function () {
    // Sticky Header Effect
    function toggleHeader() {
        if ($(window).scrollTop() > 50) {
            $('header').addClass('header-scrolled');
        } else {
            $('header').removeClass('header-scrolled');
        }
    }
    toggleHeader();
    $(window).scroll(function () {
        toggleHeader();
    });

    $('.testimonials-slider').slick({
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    arrows: false
                }
            }
        ]
    });
    $('.partners-slider').slick({
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 2,
                    arrows: false
                }
            }
        ],
        centerMode: true,
        centerPadding: '60px',
    });

    // Smooth Scroll khi click menu
    $(".click-scroll").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            lenis.scrollTo(hash, {
                offset: -70
            });
        }
    });

    // Submit form nhận báo giá
    $('#quote-form').on('submit', function (e) {
        e.preventDefault();
        const BOT_TOKEN = "8262379446:AAGSmgHyMD_5Yz4OrvgomX91QUafl5odaWw";
        const CHAT_ID = "-1003610459416";

        var link = $('#product-link').val();
        var name = $('#customer-name').val();
        var phone = $('#customer-phone').val();
        var email = $('#customer-email').val();
        var btn = $('#btn-submit');

        var originalText = btn.text();
        btn.html('<i class="fas fa-spinner fa-spin"></i> Đang gửi...').prop('disabled', true);

        var text = `🔔 *YÊU CẦU BÁO GIÁ MỚI!*` +
            `\n-------------------------` +
            `\n👤 **Khách hàng:** ${name}` +
            `\n📞 **SĐT:** ${phone}` +
            `\n📧 **Email:** ${email}` +
            `\n🔗 **Link SP:** ${link}` +
            `\n-------------------------` +
            `\n⏰ *Thời gian:* ${new Date().toLocaleString('vi-VN')}`;

        $.ajax({
            url: `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            method: 'POST',
            data: {
                chat_id: CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            },
            success: function (response) {
                alert('🚀 Gửi yêu cầu thành công! Chúng tôi sẽ liên hệ lại sớm.');
                $('#quote-form')[0].reset();
            },
            error: function (err) {
                alert('❌ Có lỗi xảy ra, vui lòng thử lại hoặc gọi hotline.');
                console.log(err);
            },
            complete: function () {
                btn.text(originalText).prop('disabled', false);
            }
        });
    });

    // Tải AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });
});
$(window).on('load', function () {
    AOS.refresh();
});

// --- LOGIC CHECK ORDER (API Google Sheets) ---
$('#check-order-form').on('submit', function (e) {
    e.preventDefault();

    var code = $('#order-code').val().trim();
    var btn = $('#btn-check');
    var resultBox = $('#order-result');
    // URL API Google Apps Script của bạn
    var apiUrl = 'https://script.google.com/macros/s/AKfycbxoZuWQ2Pv2r_r8DYUQfRYRvjnccfU50dg38R_e9vSzR6h1i8erKQuttjRrKWbM54WxaQ/exec';

    if (!code) return;

    // 1. Loading Effect
    var originalText = btn.text();
    btn.html('<i class="fas fa-spinner fa-spin"></i> Tra cứu...').prop('disabled', true);
    resultBox.slideUp();

    // 2. Call AJAX API
    $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json',
        data: {
            q: code // Gửi mã vận đơn lên server
        },
        success: function (response) {
            console.log("Full API Response:", response); // Debug log

            // Logic xử lý dữ liệu trả về 
            // Giả định: API trả về Object dữ liệu nếu tìm thấy, hoặc null/false nếu không.
            // Nếu API trả về cấu trúc { status: 'success', data: {...} } thì sửa lại: var data = response.data;
            const res = response;
            const data = res.data;

            // Kiểm tra xem data có dữ liệu hợp lệ không (Object không rỗng)
            if (data && typeof data === 'object' && Object.keys(data).length > 0 && !data.error) {

                var rowsHtml = '';

                // Duyệt qua từng Key-Value trong Object trả về
                Object.keys(data).forEach(function (key) {
                    // Bỏ qua các key hệ thống nếu có (ví dụ 'result', 'status')
                    if (key === 'result' || key === 'status') return;

                    var value = data[key];
                    var valueHtml = value || '-';

                    // Logic format hiển thị (Status màu sắc, Tiền in đậm, etc)
                    if (String(key).toLowerCase().includes('xuất kho') || String(key).toLowerCase().includes('status')) {
                        if (String(value).toLowerCase().includes('chưa')) {
                            valueHtml = `<span class="badge bg-danger">${value}</span>`;
                        } else {
                            valueHtml = `<span class="badge bg-success">${value}</span>`;
                        }
                    } else if (String(key).toLowerCase().includes('phí') || String(key).toLowerCase().includes('ship') || String(key).toLowerCase().includes('vnd') || String(key).toLowerCase().includes('đóng')) {
                        valueHtml = `<strong class="text-danger">${value}</strong>`;
                    }

                    rowsHtml += `
                        <tr>
                            <td class="col-key text-muted text-uppercase align-middle" style="font-size: 0.85rem; width: 35%; background: #f8f9fa;">${key}</td>
                            <td class="col-value fw-bold text-dark align-middle" style="font-size: 1rem;">${valueHtml}</td>
                        </tr>
                    `;
                });

                // Render HTML Table Result
                var html = `
                    <div class="result-card p-0" style="overflow: hidden;">
                        <div class="px-4 pt-3 pb-3 border-bottom d-flex justify-content-between align-items-center bg-white">
                             <h5 class="fw-bold m-0 text-primary"><i class="fas fa-file-invoice me-2"></i>CHI TIẾT ĐƠN HÀNG</h5>
                             <span class="badge bg-success rounded-pill px-3 py-2">Đã tìm thấy</span>
                        </div>
                        
                        <div class="order-table-container">
                            <table class="table table-bordered mb-0" style="border-style: hidden;">
                                <tbody>
                                    ${rowsHtml}
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="p-3 text-end bg-light">
                            <small class="text-muted fst-italic"><i class="fas fa-clock me-1"></i> Dữ liệu từ hệ thống kho.</small>
                        </div>
                    </div>
                `;
                resultBox.html(html).slideDown();

            } else {
                // Trường hợp API trả về thành công nhưng không có dữ liệu (Không tìm thấy đơn)
                showNotFoundError(resultBox, code);
            }
        },
        error: function (xhr, status, error) {
            console.error("API Error:", error);
            // Có thể API Google trả về lỗi hoặc parse JSON lỗi
            showNotFoundError(resultBox, code, "Có lỗi kết nối hoặc mã không tồn tại.");
        },
        complete: function () {
            // Reset button dù thành công hay thất bại
            btn.text(originalText).prop('disabled', false);
        }
    });
});

// Helper hiển thị lỗi
function showNotFoundError(box, code, message) {
    var msg = message || `Mã vận đơn <strong>${code}</strong> không tồn tại hoặc chưa được cập nhật.`;
    box.html(`
        <div class="alert alert-danger shadow-sm" role="alert" style="border-radius: 10px;">
            <div class="d-flex align-items-center">
                <i class="fas fa-search-minus fa-2x me-3"></i>
                <div>
                    <h6 class="alert-heading fw-bold mb-1">Không tìm thấy đơn hàng!</h6>
                    <small>${msg}</small>
                </div>
            </div>
        </div>
    `).slideDown();
}