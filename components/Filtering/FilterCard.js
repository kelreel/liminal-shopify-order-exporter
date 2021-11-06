import {
  Tag,
  Card,
  Button,
  ButtonGroup,
  Stack,
  TextContainer,
  ActionList,
  Popover,
  ChoiceList,
  DatePicker,
  Link,
} from '@shopify/polaris';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';

const FilterCard = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [{ month, year }, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [datePopoverActive, setDatePopoverActive] = useState(false);
  const [statusPopoverActive, setStatusPopoverActive] = useState(false);
  const [paymentStatusPopoverActive, setPaymentStatusPopoverActive] = useState(false);
  const [fulfillmentStatusPopoverActive, setFulfillmentStatusPopoverActive] = useState(false);

  const [dateChoiceSelected, setDateChoiceSelected] = useState(['after']);
  const dateChoices = [
    { label: 'On:', value: 'on' },
    { label: 'After:', value: 'after' },
    { label: 'Between:', value: 'between' },
    { label: 'Before:', value: 'before' },
  ];
  const handleCommonDatesFilterButton = (period) => () => {
    let tagString;
    let formattedStartDate = moment().subtract(period, 'days').format('MMM D, YYYY');
    let formattedEndDate = moment().format('MMM D, YYYY'); //today
    if (period == 0) {
      tagString = 'Date: Today';
    } else {
      tagString = `Date: Between ${formattedStartDate} - ${formattedEndDate}`;
    }
    addTag(tagString);
  };
  const handleAddDateFilterButton = () => {
    let tagString;
    let formattedStartDate = moment(selectedDates.start).format('MMM D, YYYY');
    let formattedEndDate = moment(selectedDates.end).format('MMM D, YYYY');
    if (dateChoiceSelected[0] === 'between') {
      tagString = `Date: Between ${formattedStartDate} - ${formattedEndDate}`;
    } else {
      tagString = `Date: ${dateChoiceSelected[0][0].toUpperCase()}${dateChoiceSelected[0].slice(
        1
      )} ${formattedEndDate}`;
    }
    addTag(tagString);
    setDatePopoverActive(false);
  };
  const handleMonthChange = useCallback((month, year) => setDate({ month, year }), []);
  const handleDateChoiceChange = useCallback((value) => setDateChoiceSelected(value), []);
  const toggleDatePopoverActive = useCallback(
    () => setDatePopoverActive((popoverActive) => !popoverActive),
    []
  );
  const removeTag = useCallback(
    (tag) => () => {
      setSelectedTags((previousTags) => previousTags.filter((previousTag) => previousTag !== tag));
    },
    []
  );
  const addTag = useCallback(
    (tag) =>
      setSelectedTags((previousTags) => {
        if (tag.includes('Date')) {
          return [...previousTags.filter((previousTag) => !previousTag.includes('Date')), tag];
        }
        return [...previousTags, tag];
      }),
    []
  );
  const clearFilters = useCallback(() => setSelectedTags([]), []);
  const tagMarkup = selectedTags.map((option) => (
    <Tag key={option} onRemove={removeTag(option)}>
      {option}
    </Tag>
  ));

  return (
    <Card title="Filtering">
      <Card.Section>
        <TextContainer>
          <Stack>
            <Button plain onClick={handleCommonDatesFilterButton(0)}>
              Today
            </Button>
            <Button plain onClick={handleCommonDatesFilterButton(7)}>
              Last 7 days
            </Button>
            <Button plain onClick={handleCommonDatesFilterButton(30)}>
              Last 30 days
            </Button>
            <Button plain onClick={handleCommonDatesFilterButton(90)}>
              Last 90 days
            </Button>
            <Button plain onClick={handleCommonDatesFilterButton(365)}>
              Last 12 months
            </Button>
          </Stack>
          <Stack>
            <ButtonGroup segmented>
              <Popover
                fullHeight
                preferredAlignment="left"
                active={datePopoverActive}
                activator={
                  <Button disclosure="down" onClick={toggleDatePopoverActive}>
                    Date
                  </Button>
                }
                onClose={toggleDatePopoverActive}
              >
                <Popover.Pane>
                  <Popover.Section>
                    <ChoiceList
                      choices={dateChoices}
                      selected={dateChoiceSelected}
                      onChange={handleDateChoiceChange}
                    ></ChoiceList>
                  </Popover.Section>
                  <Popover.Section>
                    <DatePicker
                      month={month}
                      year={year}
                      onChange={setSelectedDates}
                      onMonthChange={handleMonthChange}
                      selected={selectedDates}
                      allowRange={dateChoiceSelected[0] === 'between'}
                      disableDatesAfter={new Date()}
                      multiMonth={dateChoiceSelected[0] === 'between'}
                    />
                    <Button primary fullWidth onClick={handleAddDateFilterButton}>
                      Add Filter
                    </Button>
                  </Popover.Section>
                </Popover.Pane>
              </Popover>
              <Popover
                active={false}
                activator={<Button disclosure="down">Status</Button>}
                onClose={() => {}}
                ariaHaspopup={false}
              ></Popover>
              <Popover
                active={false}
                activator={<Button disclosure="down">Payment Status</Button>}
                onClose={() => {}}
                ariaHaspopup={false}
              ></Popover>
              <Popover
                active={false}
                activator={<Button disclosure="down">Fulfillment Status</Button>}
                onClose={() => {}}
                ariaHaspopup={false}
              ></Popover>
            </ButtonGroup>
            <Button plain destructive onClick={clearFilters}>
              Clear Filters
            </Button>
          </Stack>
          <Stack spacing="tight">{tagMarkup}</Stack>
        </TextContainer>
      </Card.Section>
    </Card>
  );
};

export default FilterCard;
