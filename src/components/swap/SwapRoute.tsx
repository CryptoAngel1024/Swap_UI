import { Trans } from '@lingui/macro'
import { Currency, TradeType } from '@uniswap/sdk-core'
import AnimatedDropdown from 'components/AnimatedDropdown'
import { AutoColumn } from 'components/Column'
import { LoadingRows } from 'components/Loader/styled'
import { AutoRow, RowBetween } from 'components/Row'
import useAutoRouterSupported from 'hooks/useAutoRouterSupported'
import { memo, useState } from 'react'
import { Plus } from 'react-feather'
import { InterfaceTrade } from 'state/routing/types'
import { useDarkModeManager } from 'state/user/hooks'
import styled from 'styled-components/macro'
import { Separator, ThemedText } from 'theme'

import { AutoRouterLabel, AutoRouterLogo } from './RouterLabel'

const Wrapper = styled(AutoColumn)<{ darkMode?: boolean; fixedOpen?: boolean }>`
  padding: ${({ fixedOpen }) => (fixedOpen ? '12px' : '12px 8px 12px 12px')};
  border-radius: 16px;
  border: 1px solid ${({ theme, fixedOpen }) => (fixedOpen ? 'transparent' : theme.bg2)};
  cursor: pointer;
`

const OpenCloseIcon = styled(Plus)<{ open?: boolean }>`
  margin-left: 8px;
  height: 20px;
  stroke-width: 2px;
  transition: transform 0.1s;
  transform: ${({ open }) => (open ? 'rotate(45deg)' : 'none')};
  stroke: ${({ theme }) => theme.text3};
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`

interface SwapRouteProps extends React.HTMLAttributes<HTMLDivElement> {
  trade: InterfaceTrade<Currency, Currency, TradeType>
  syncing: boolean
  fixedOpen?: boolean // fixed in open state, hide open/close icon
}

export default memo(function SwapRoute({ trade, syncing, fixedOpen = false, ...rest }: SwapRouteProps) {
  const autoRouterSupported = useAutoRouterSupported()
  const [open, setOpen] = useState(false)

  const [darkMode] = useDarkModeManager()

  return (
    <Wrapper {...rest} darkMode={darkMode} fixedOpen={fixedOpen}>
      <RowBetween onClick={() => setOpen(!open)}>
        <AutoRow gap="4px" width="auto">
          <AutoRouterLogo />
          <AutoRouterLabel />
        </AutoRow>
        {fixedOpen ? null : <OpenCloseIcon open={open} />}
      </RowBetween>
      <AnimatedDropdown open={open || fixedOpen}>
        <AutoRow gap="4px" width="auto" style={{ paddingTop: '12px', margin: 0 }}>
          <LoadingRows>
            <div style={{ width: '400px', height: '30px' }} />
          </LoadingRows>

          {autoRouterSupported && (
            <>
              <Separator />

              <ThemedText.Main fontSize={12} width={400} margin={0}>
                {' '}
                <Trans>
                  This route optimizes your total output by considering split routes, multiple hops, and the gas cost of
                  each step.
                </Trans>
              </ThemedText.Main>
            </>
          )}
        </AutoRow>
      </AnimatedDropdown>
    </Wrapper>
  )
})
