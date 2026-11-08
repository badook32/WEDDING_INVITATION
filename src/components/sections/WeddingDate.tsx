import { useEffect, useState } from "react";
import styled from "styled-components";
import { Container } from "@/components/layout/Container";
import { invitation } from "@/data/invitation";
import {
  formatCeremonyDateShort,
  formatCeremonyDateTime,
  toDateTimeAttribute,
} from "@/lib/ceremony";

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"] as const;

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

/** 한국 시간으로 달력을 만든다. 실행 브라우저의 시간대에 영향을 받지 않는다. */
function getCeremonyCalendar(startsAt: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(startsAt));

  const getNumber = (name: Intl.DateTimeFormatPartTypes) => {
    const value = parts.find((part) => part.type === name)?.value;
    if (value === undefined) throw new Error("예식 날짜 정보가 없습니다: " + name);
    return Number(value);
  };

  const year = getNumber("year");
  const month = getNumber("month");
  const day = getNumber("day");
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const cellCount = Math.ceil((firstWeekday + lastDay) / 7) * 7;
  const cells = Array.from({ length: cellCount }, (_, index) => {
    const date = index - firstWeekday + 1;
    return date >= 1 && date <= lastDay ? date : null;
  });

  return { year, month, day, cells };
}

export function WeddingDate() {
  const { ceremony, couple } = invitation;
  const calendar = getCeremonyCalendar(ceremony.startsAt);
  const [remaining, setRemaining] = useState<RemainingTime | null>(null);
  const ceremonyTime = formatCeremonyDateTime(ceremony.startsAt);
  const schedule = ceremonyTime.split("일 ").slice(1).join("일 ") || ceremonyTime;

  useEffect(() => {
    const update = () => setRemaining(getRemainingTime(ceremony.startsAt, Date.now()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [ceremony.startsAt]);

  const numbers = [
    { value: remaining?.days, label: "DAYS" },
    { value: remaining?.hours, label: "HOURS" },
    { value: remaining?.minutes, label: "MIN" },
    { value: remaining?.seconds, label: "SEC" },
  ];

  return (
    <Container>
      <DateArea aria-labelledby="wedding-date-heading">
        <Ornament aria-hidden="true">✿</Ornament>
        <Eyebrow>INVITATION</Eyebrow>
        <DateHeading id="wedding-date-heading">
          {formatCeremonyDateShort(ceremony.startsAt).replaceAll(".", ". ")}
        </DateHeading>
        <Schedule>
          <time dateTime={toDateTimeAttribute(ceremony.startsAt)}>
            {schedule}
          </time>
        </Schedule>

        <CalendarCard>
          <CalendarMonth>{calendar.year}년 {calendar.month}월</CalendarMonth>
          <CalendarGrid aria-label={`${calendar.year}년 ${calendar.month}월 예식 달력`}>
            {WEEKDAYS.map((weekday, index) => (
              <Weekday key={weekday} $sunday={index === 0} $saturday={index === 6}>
                {weekday}
              </Weekday>
            ))}
            {calendar.cells.map((date, index) => {
              const selected = date === calendar.day;
              const weekday = index % 7;
              return (
                <DayCell key={index}>
                  {date === null ? null : (
                    <DayNumber
                      $selected={selected}
                      $sunday={weekday === 0}
                      $saturday={weekday === 6}
                    >
                      {selected ? (
                        <time dateTime={toDateTimeAttribute(ceremony.startsAt)} aria-label="결혼식 날짜">
                          {date}
                        </time>
                      ) : date}
                    </DayNumber>
                  )}
                </DayCell>
              );
            })}
          </CalendarGrid>
        </CalendarCard>

        <CountdownCard aria-label="결혼식까지 남은 시간">
          {numbers.map(({ value, label }, index) => (
            <Counter key={label}>
              <CounterNumber $accent={index === 0}>
                {value === undefined || remaining === null
                  ? "–"
                  : index === 0 ? String(value) : String(value).padStart(2, "0")}
              </CounterNumber>
              <CounterLabel>{label}</CounterLabel>
            </Counter>
          ))}
        </CountdownCard>
        <CountdownSummary>
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
  padding: 56px 0 16px;
  text-align: center;
`;

const Ornament = styled.div`
  margin-bottom: 15px;
  color: #a8434a;
  font-size: 20px;
`;

const Eyebrow = styled.p`
  margin: 0 0 8px;
  color: #79716e;
  font-size: 11px;
  letter-spacing: 0.25em;
`;

const DateHeading = styled.h2`
  margin: 0 0 8px;
  color: #3e3a39;
  font-size: clamp(22px, 6vw, 28px);
  font-weight: 600;
  letter-spacing: 0.06em;
`;

const Schedule = styled.p`
  margin: 0 0 28px;
  color: #79716e;
  font-size: 13px;
`;

const CalendarCard = styled.div`
  width: 100%;
  max-width: 340px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #e7e0dd;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  box-shadow: 0 4px 18px rgba(62, 58, 57, 0.04);
`;

const CalendarMonth = styled.div`
  padding-bottom: 12px;
  margin-bottom: 13px;
  border-bottom: 1px solid #ece6e4;
  font-size: 14px;
  font-weight: 600;
  color: #3e3a39;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px 0;
`;

const Weekday = styled.div<{ $sunday: boolean; $saturday: boolean }>`
  padding-bottom: 4px;
  color: ${({ $sunday, $saturday }) => $sunday ? "#a8434a" : $saturday ? "#5375a1" : "#938b88"};
  font-family: Arial, sans-serif;
  font-size: 10px;
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
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: ${({ $selected, $sunday, $saturday }) =>
    $selected ? "#fff" : $sunday ? "#a8434a" : $saturday ? "#5375a1" : "#514b49"};
  background: ${({ $selected }) => $selected ? "#a8434a" : "transparent"};
  font-size: 13px;
  font-weight: ${({ $selected }) => $selected ? "700" : "400"};
  box-shadow: ${({ $selected }) => $selected ? "0 2px 10px rgba(168,67,74,0.25)" : "none"};
  animation: ${({ $selected }) => $selected ? "gentle-beat 2.2s ease-in-out infinite" : "none"};

  @keyframes gentle-beat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.06); }
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const CountdownCard = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  max-width: 340px;
  margin: 22px auto 0;
  padding: 14px 9px;
  border: 1px solid #e7e0dd;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.75);
`;

const Counter = styled.div`
  min-width: 0;
`;

const CounterNumber = styled.p<{ $accent: boolean }>`
  margin: 0 0 3px;
  color: ${({ $accent }) => $accent ? "#a8434a" : "#3e3a39"};
  font-family: Arial, sans-serif;
  font-size: 21px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
`;

const CounterLabel = styled.p`
  margin: 0;
  color: #938b88;
  font-family: Arial, sans-serif;
  font-size: 10px;
  letter-spacing: 0.04em;
`;

const CountdownSummary = styled.p`
  margin: 14px auto 0;
  color: #79716e;
  font-size: 12px;
  line-height: 1.7;
`;
