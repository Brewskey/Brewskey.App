import { useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import SoftApService from '../../SoftApService';

import type { UseMutationResult } from '@tanstack/react-query';

import type { WifiNetwork } from '../../types';

enum SoftApQueryKeys {
  GetParticleId = 'get_particle_id',
  GetWifiNetworks = 'get_wifi_networks',
}

export const useClearAllQueryCaches = () => {
  const queryClient = useQueryClient();
  useEffect(() => {
    queryClient.removeQueries({
      queryKey: [SoftApQueryKeys.GetParticleId],
    });
    queryClient.removeQueries({
      queryKey: [SoftApQueryKeys.GetWifiNetworks],
    });
  }, []);
};

export const useGetParticleId = () =>
  useQuery({
    queryKey: [SoftApQueryKeys.GetParticleId],
    queryFn: async () => SoftApService.getParticleID(),
    retry: true,
  });
export const useGetWifiNetworks = () =>
  useQuery({
    queryKey: [SoftApQueryKeys.GetWifiNetworks],
    queryFn: async () => SoftApService.scanWifi(),
    retry: true,
  });

export const useConfigureWifi = () =>
  useMutation({
    mutationFn: async (wifiNetwork: WifiNetwork) =>
      SoftApService.configureWifi(wifiNetwork),
  });
export const useConnectToWifi = () =>
  useMutation({
    mutationFn: async (networkIndex?: number) =>
      SoftApService.connectWifi(networkIndex),
  });

export const useSetupWifi = (): UseMutationResult<void, Error, WifiNetwork> =>
  useMutation({
    mutationFn: async (wifiNetwork) => {
      const key = await SoftApService.configureWifi(wifiNetwork);
      console.log('key', key);
      await SoftApService.connectWifi().then(console.log).catch(console.error);
    },
  });
