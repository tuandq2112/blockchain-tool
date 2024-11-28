import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { Lunar } from 'lunar-javascript';

// Hàm lấy ngày Tết Âm lịch
function getTetDate(year) {
    const lunarNewYear = Lunar.fromYmd(year, 1, 1).getSolar();
    return moment.tz(`${lunarNewYear.getYear()}-${lunarNewYear.getMonth()}-${lunarNewYear.getDay()}`, 'YYYY-M-D', 'Asia/Ho_Chi_Minh');
}

// Component chính
export default function Home() {
    const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        // Hàm tính thời gian còn lại
        const calculateTimeUntilTet = () => {
            const today = moment().tz('Asia/Ho_Chi_Minh');
            const currentYear = today.year();
            let tetDate = getTetDate(currentYear);

            // Nếu Tết năm nay đã qua, tính cho năm sau
            if (today.isAfter(tetDate)) {
                tetDate = getTetDate(currentYear + 1);
            }
            // Tính thời gian còn lại
            const duration = moment.duration(tetDate.diff(today));
            const days = Math.floor(duration.asDays());
            const hours = duration.hours();
            const minutes = duration.minutes();
            const seconds = duration.seconds();

            // Cập nhật state
            setTimeRemaining(
                {
                    days,
                    hours,
                    minutes,
                    seconds,
                });
        };

        // Tính ngay lập tức và cập nhật mỗi giây
        calculateTimeUntilTet();
        const interval = setInterval(calculateTimeUntilTet, 1000);

        // Clear interval khi component unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1 style={{ fontSize: '3rem', color: '#FF6347', marginBottom: '20px' }}>Đếm ngược đến Tết Âm lịch</h1>
            <div style={styles.container}>
                <h1 style={styles.heading}>Countdown to Target Date</h1>
                <div style={styles.time}>
                    <div style={styles.timeUnit}>
                        <div style={styles.number}>{timeRemaining.days}</div>
                        <div style={styles.label}>Days</div>
                    </div>
                    <div style={styles.timeUnit}>
                        <div style={styles.number}>{timeRemaining.hours}</div>
                        <div style={styles.label}>Hours</div>
                    </div>
                    <div style={styles.timeUnit}>
                        <div style={styles.number}>{timeRemaining.minutes}</div>
                        <div style={styles.label}>Minutes</div>
                    </div>
                    <div style={styles.timeUnit}>
                        <div style={styles.number}>{timeRemaining.seconds}</div>
                        <div style={styles.label}>Seconds</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: '50px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '30px',
        color: '#333',
    },
    time: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        fontSize: '1.8rem',
    },
    timeUnit: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontWeight: 'bold',
        color: '#333',
    },
    number: {
        fontSize: '3rem',
        color: '#FF6347',
    },
    label: {
        fontSize: '1.2rem',
        color: '#777',
    },
};