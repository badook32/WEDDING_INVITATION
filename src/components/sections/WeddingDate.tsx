import { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { invitation } from "@/data/invitation";
import { formatCeremonyDateTime, toDateTimeAttribute } from "@/lib/ceremony";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

interface RemainingTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

function getRemainingTime(startsAt: string, now: number): RemainingTime {
  const difference = new Date(startsAt).getTime() - now;
  const secondsLeft = Math.max(0, Math.floor(difference / 1000));
  return {
    days: Math.floor(secondsLeft / 86400),
    hours: Math.floor((secondsLeft % 86400) / 3600),
    minutes: Math.floor((secondsLeft % 3600) / 60),
    seconds: secondsLeft % 60,
    finished: difference <= 0,
  };
}

/** 브라우저 시간대와 무관하게 한국의 예식 날짜로 달력을 생성한다. */
function getCeremonyCalendar(startsAt: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(startsAt));
  const number = (type: Intl.DateTimeFormatPartTypes) => {
    const part = parts.find((value) => value.type === type);
    if (!part) throw new Error(`예식 날짜에 ${type} 정보가 없습니다.`);
    return Number(part.value);
  };
  const year = number("year");
  const month = number("month");
  const day = number("day");
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cellCount = Math.ceil((firstWeekday + lastDay) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const value = index - firstWeekday + 1;
    return value >= 1 && value <= lastDay ? value : null;
  });
  return { year, month, day, cells };
}

export function WeddingDate() {
  const { ceremony, couple } = invitation;
  const calendar = getCeremonyCalendar(ceremony.startsAt);
  const [remaining, setRemaining] = useState<RemainingTime | null>(null);
  const ceremonyText = formatCeremonyDateTime(ceremony.startsAt).replace(/ 00분$/, "");

  useEffect(() => {
    const update = () => setRemaining(getRemainingTime(ceremony.startsAt, Date.now()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [ceremony.startsAt]);

  const counters = [
    { label: "Day", value: remaining?.days },
    { label: "Hour", value: remaining?.hours },
    { label: "Min", value: remaining?.minutes },
    { label: "Sec", value: remaining?.seconds },
  ];

  return (
    <Container>
      <DateArea aria-labelledby="wedding-date-heading">
        <DateHeading id="wedding-date-heading">Our Wedding Day</DateHeading>
        <Schedule>
          <time dateTime={toDateTimeAttribute(ceremony.startsAt)}>{ceremonyText}</time>
        </Schedule>

        <CalendarCard>
          <CalendarMonth>{calendar.month}월</CalendarMonth>
          <CalendarGrid aria-label={`${calendar.year}년 ${calendar.month}월 예식 달력`}>
            {WEEKDAYS.map((weekday, index) => (
              <Weekday key={weekday} $sunday={index === 0} $saturday={index === 6}>
                {weekday}
              </Weekday>
            ))}
            {calendar.cells.map((day, index) => (
              <DayCell key={index}>
                {day !== null && (
                  <DayNumber
                    $selected={day === calendar.day}
                    $sunday={index % 7 === 0}
                    $saturday={index % 7 === 6}
                  >
                    {day === calendar.day ? (
                      <time dateTime={toDateTimeAttribute(ceremony.startsAt)} aria-label="결혼식 날짜">
                        {day}
                      </time>
                    ) : day}
                  </DayNumber>
                )}
              </DayCell>
            ))}
          </CalendarGrid>

          <Countdown aria-label="결혼식까지 남은 시간">
            {counters.map(({ label, value }, index) => (
              <Counter key={label}>
                <CounterLabel>{label}</CounterLabel>
                <CounterNumber $accent={index === 0}>
                  {remaining === null || value === undefined
                    ? "--"
                    : String(value).padStart(2, "0")}
                </CounterNumber>
              </Counter>
            ))}
          </Countdown>
        </CalendarCard>
        <CountdownSummary aria-live="off">
          {remaining === null
            ? "결혼식까지 남은 시간을 계산하고 있습니다."
            : remaining.finished
              ? "소중한 날에 함께해 주셔서 감사합니다."
              : `${couple.groom.name} ♥ ${couple.bride.name}의 결혼식이 ${remaining.days}일 남았습니다.`}
        </CountdownSummary>
      </DateArea>
    </Container>
  );
}

const DateArea = styled.section`
  padding: 45px 0 9px;
  text-align: center;
`;
const DateHeading = styled.h2`
  margin: 0 0 17px;
  color: ${({ theme }) => theme.color.accent};
  font-size: clamp(25px, 6.3vw, 31px);
  font-weight: 400;
  letter-spacing: 0.035em;
`;
const Schedule = styled.p`
  margin: 0 0 30px;
  color: ${({ theme }) => theme.color.text};
  font-size: clamp(13px, 3.6vw, 17px);
  font-weight: 500;
`;
const CalendarCard = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 24px clamp(13px, 4vw, 30px) 23px;
  border-radius: 18px;
  background: #fff6f2;
`;
const CalendarMonth = styled.div`
  padding-bottom: 15px;
  margin-bottom: 16px;
  border-bottom: 1px solid #efb3a7;
  color: ${({ theme }) => theme.color.accent};
  font-size: 25px;
  font-weight: 500;
`;
const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px 0;
`;
const Weekday = styled.div<{ $sunday: boolean; $saturday: boolean }>`
  padding-bottom: 4px;
  color: ${({ $sunday, $saturday, theme }) =>
    $sunday ? theme.color.accent : $saturday ? "#6b7eb1" : theme.color.text};
  font-size: 12px;
  font-weight: 600;
`;
const DayCell = styled.div`
  display: flex;
  height: 37px;
  align-items: center;
  justify-content: center;
`;
const DayNumber = styled.span<{ $selected: boolean; $sunday: boolean; $saturday: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  color: ${({ $selected, $sunday, $saturday, theme }) =>
    $selected ? "#fff" : $sunday ? theme.color.accent : $saturday ? "#6b7eb1" : theme.color.text};
  background: ${({ $selected, theme }) => $selected ? theme.color.accent : "transparent"};
  font-size: 14px;
  font-weight: ${({ $selected }) => $selected ? 700 : 400};
`;
const Countdown = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 5px;
  margin-top: 20px;
  padding: 20px 0 2px;
  border-top: 1px solid #efb3a7;
`;
const Counter = styled.div`
  min-width: 0;
`;
const CounterLabel = styled.p`
  margin: 0 0 8px;
  color: ${({ theme }) => theme.color.accent};
  font-family: Arial, sans-serif;
  font-size: 12px;
`;
const CounterNumber = styled.p<{ $accent: boolean }>`
  margin: 0;
  color: ${({ $accent, theme }) => $accent ? theme.color.accent : theme.color.text};
  font-family: Arial, sans-serif;
  font-size: clamp(24px, 7vw, 33px);
  font-variant-numeric: tabular-nums;
  font-weight: 400;
`;
const CountdownSummary = styled.p`
  margin: 22px 0 0;
  color: ${({ theme }) => theme.color.textMuted};
  font-size: clamp(11px, 3.1vw, 13px);
  line-height: 1.8;
`;
