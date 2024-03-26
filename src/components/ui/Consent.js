import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { colors } from '../../styles/variables'
import { isBrowser } from '../../utils/helper-functions'
import { useLocation } from '@reach/router'
import { initializeAndTrack } from 'gatsby-plugin-gdpr-cookies'

import Notification from './Notification'
import Button from './Button'
import { Flexbox } from '../layout/Flexbox'
import { Link } from 'gatsby'
import Content from './Content'

const Banner = styled(Notification)`
  position: fixed;
  bottom: 16px;
  right: 16px;
  box-shadow: ${colors.shadow.layeredSmall};
  max-width: 300px;
`

function getValue(key, defaultValue) {
  return isBrowser() && window.localStorage.getItem(key)
    ? JSON.parse(window.localStorage.getItem(key))
    : defaultValue
}

function setValue(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

function useStickyState(defaultValue, key) {
  const [value, setter] = useState(() => {
    return getValue(key, defaultValue)
  })

  useEffect(() => {
    setValue(key, value)
  }, [key, value])

  return [value, setter]
}

const CookieConsent = () => {
  const location = useLocation()

  if (isBrowser()) {
    initializeAndTrack(location)
  }

  const [bannerHidden, setBannerHidden] = useStickyState(
    false,
    'consentCookieHidden',
  );

  const EnableAnalytics = (value) => {
    document.cookie = `gatsby-gdpr-google-analytics=${value}`;
    setBannerHidden(true);
  };

  return (
    <>
      {!bannerHidden && (
        <Banner
          borderradius="8px"
          padding="16px"
          flexdirection="column"
        >
          <Content
            paragraphfontsize="0.875rem"
            paragraphlineheight="1.2"
            linktextdecoration="underline"
          >
            <p>
              We use cookies to personalize content and analyze our
              traffic. <Link to="/privacy">Privacy Policy</Link>.
            </p>
          </Content>
          <Flexbox
            margin="8px 0 0"
          >
            <Button
              onClick={() => EnableAnalytics("false")}
              fontsize="0.875rem"
              padding="4px 8px"
              margin="0 8px 0 0"
              width="50%"
              backgroundcolor={colors.gray.twoHundred}
              color={colors.gray.nineHundred}
            >
              Decline
            </Button>
            <Button
              onClick={() => EnableAnalytics("true")}
              fontsize="0.875rem"
              padding="4px 8px"
              width="50%"
            >
              Accept
            </Button>
          </Flexbox>
        </Banner>
      )}
    </>
  );
};

export default CookieConsent;