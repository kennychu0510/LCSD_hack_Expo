import { useState } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { LCSD_URL, DATE_FORMAT } from './utilities/constants';
import { getToday, getVenueByValue, getVenueForEnquiry } from './utilities/helper';
import FacilitySelect from './components/FacilitySelect';
import Images from './assets/index';
import { Moment } from 'moment';
import DatePickerModal from './components/DatePickerModal';
import { getSportIcon } from './utilities/sportIcon';
import VenueSelect from './components/VenueSelect';
import EnquiryWebview from './components/EnquiryWebview';
import Button from './components/Button';
import EnquiryResultModal, {
  EnquiryResult,
} from './components/EnquiryResultModal';

type Tab = 'date' | 'facility' | 'venue' | null;

export default function App() {
  const [enquiry, setEnquiry] = useState<{
    date: Moment;
    facility: ISport | null;
    venue: string;
  }>({
    date: getToday(),
    facility: null,
    venue: '',
  });
  const [modalOpen, setModalOpen] = useState<Tab>(null);
  const [isEnquirying, setIsEnquiring] = useState(false);
  const [enquiryResult, setEnquiryResult] = useState<EnquiryResult | null>(
    null
  );
  const [resultsModalOpen, setResultsModalOpen] = useState(false);

  function setSelectedDate(date: string) {
    setEnquiry((enquiry) => ({ ...enquiry, date }));
    closeModal();
  }

  function closeModal() {
    setModalOpen(null);
  }

  function setSelectedFacility(facility: ISport | null) {
    setEnquiry((enquiry) => ({ ...enquiry, facility }));
    closeModal();
  }

  function setSelectedVenue(venue: string) {
    setEnquiry((enquiry) => ({ ...enquiry, venue }));
    closeModal();
  }

  function openTab(tab: Tab) {
    setModalOpen((isOpen) => {
      if (isOpen && isOpen === tab) {
        return null;
      } else {
        return tab;
      }
    });
  }


  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => openTab('date')}
        style={styles.selectionRow}>
        <View style={styles.flexRow}>
          <Image source={Images.schedule} style={styles.icon} />
          <Text style={styles.label}>Date</Text>
        </View>
        <Text style={{ fontSize: 16 }}>{enquiry.date.format(DATE_FORMAT)}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => openTab('facility')}
        style={styles.selectionRow}>
        <View style={styles.flexRow}>
          <Image
            source={getSportIcon(enquiry?.facility?.name ?? '')}
            style={[styles.icon, {marginLeft: -2}]}
          />
          <Text style={styles.label}>Facility</Text>
        </View>

        <View style={{ flexShrink: 1 }}>
          <Text style={[{ fontSize: 16, textAlign: 'right' }, { color: enquiry.facility ? '#000' : '#888'}]}>
            {enquiry.facility?.name ?? 'Select a Facility'}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => openTab('venue')}
        style={styles.selectionRow}>
        <View style={styles.flexRow}>
          <Image source={Images.venue} style={styles.icon} />
          <Text style={styles.label}>Venue</Text>
        </View>
        <View style={{ flexShrink: 1 }}>
          <Text style={[{ fontSize: 16, textAlign: 'right' }, { color: enquiry.venue ? '#000' : '#888'}]}>
            {getVenueByValue(enquiry.venue)?.venueName ?? 'Select a Venue'}
          </Text>
        </View>
      </TouchableOpacity>

      {modalOpen === 'date' && (
        <DatePickerModal
          selectedDate={enquiry.date}
          setSelectedDate={setSelectedDate}
          closeModal={closeModal}
        />
      )}
      {modalOpen === 'facility' && (
        <FacilitySelect
          selectedFacility={enquiry.facility}
          setFacility={setSelectedFacility}
          onReset={() => setSelectedFacility(null)}
          selectedVenue={enquiry.venue}
        />
      )}
      {modalOpen === 'venue' && (
        <VenueSelect
          facility={enquiry.facility}
          venue={enquiry.venue}
          clearFacility={() => setSelectedFacility(null)}
          setVenue={setSelectedVenue}
        />
      )}
      <View
        style={{
          position: modalOpen ? 'absolute' : 'relative',
          flex: 1,
          zIndex: -1,
        }}>
        <EnquiryWebview
          enquiryOption={{
            venue: getVenueForEnquiry(enquiry.venue, enquiry.facility?.value),
            date: enquiry.date.toDate(),
          }}
          setEnquiryResult={setEnquiryResult}
          visible={!modalOpen}
          goToResults={() => setResultsModalOpen(true)}
          setIsEnquiring={setIsEnquiring}
        />
      </View>
      {!!enquiryResult && !isEnquirying && !modalOpen && (
        <>
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Button
              label="Last Enquiry Results"
              onPress={() => setResultsModalOpen(true)}
              variant="tertiary"
            />
          </View>
          {resultsModalOpen && (
            <EnquiryResultModal
              closeModal={() => setResultsModalOpen(false)}
              results={enquiryResult}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectionRow: {
    marginHorizontal: 15,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 10,
  },
});
